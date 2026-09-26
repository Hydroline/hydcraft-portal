import { prisma } from '../db/prisma'
import {
	buildMinecraftAccountSummary,
	buildUnboundPlayerSummary,
	minecraftAccountSummaryPlayerInclude,
} from '../minecraft/account-summary'
import {
	getMinecraftBodyRendererUrl,
	getMinecraftSkinRendererUrl,
} from '../../../utils/minecraft/body-renderer'
import { createLuckPermsPrimaryGroupResolver } from '../luckperms/primary-group'
import { readLuckPermsSnapshotBundle } from '../luckperms/snapshot'
import {
	DEFAULT_SERVER_OVERVIEW_PLAYER_ACCENT,
	type ServerOverviewRecommendedPlayer,
} from '../../../utils/server/overview'
import {
	prioritizeRecommendations,
	type RecommendationSelection,
} from './recommendation-selection'

const PLAYER_INCLUDE = minecraftAccountSummaryPlayerInclude

const buildRecommendedPlayerItem = async (
	normalizedUsername: string,
): Promise<ServerOverviewRecommendedPlayer | null> => {
	const players = await prisma.minecraftServerPlayer.findMany({
		where: {
			normalizedUsername,
		},
		include: PLAYER_INCLUDE,
		orderBy: [{ online: 'desc' }, { bridgeSyncedAt: 'desc' }],
	})

	if (players.length === 0) {
		return null
	}

	const [account, authMeAccount] = await Promise.all([
		prisma.minecraftAccount.findFirst({
			where: {
				normalizedUsername,
				unlinkedAt: null,
			},
			include: {
				authMeAccount: true,
			},
			orderBy: [{ isPrimary: 'desc' }, { updatedAt: 'desc' }],
		}),
		prisma.authMeAccount.findUnique({
			where: {
				normalizedUsername,
			},
		}),
	])

	const observedNames = players
		.map(
			(player) => player.username ?? player.playerData?.lastKnownName ?? null,
		)
		.filter((value): value is string => Boolean(value))
	const accountName = account?.username ?? account?.authmeName ?? null
	const displayName = observedNames[0] ?? accountName ?? normalizedUsername

	const luckPermsResolver = createLuckPermsPrimaryGroupResolver(
		await readLuckPermsSnapshotBundle({
			uuids: players.map((player) => player.uuid),
			normalizedUsernames: [normalizedUsername],
		}),
	)

	const summary = account
		? buildMinecraftAccountSummary(account, players, [], luckPermsResolver)
		: buildUnboundPlayerSummary(players, luckPermsResolver)

	if (!summary) {
		return null
	}

	const playerId =
		summary.playerIdentity.playerId ??
		summary.username ??
		displayName ??
		normalizedUsername

	return {
		normalizedUsername,
		mcid: playerId,
		username: playerId,
		skinBodyUrl: getMinecraftBodyRendererUrl(displayName),
		skinImageUrl: getMinecraftSkinRendererUrl(displayName),
		playTimeTicks: summary.playerProfile.playTimeTicks,
		hasStats: summary.playerProfile.hasStats,
		authMeLastLoginAt: authMeAccount?.lastLoginAt?.toISOString() ?? null,
		accentColor: { ...DEFAULT_SERVER_OVERVIEW_PLAYER_ACCENT },
	}
}

export const listRecommendedPlayers = async (
	selection: RecommendationSelection = {},
): Promise<ServerOverviewRecommendedPlayer[]> => {
	const accounts = await prisma.minecraftAccount.findMany({
		where: { authMeAccount: { isNot: null } },
		select: { normalizedUsername: true },
	})
	const names = accounts
		.map((account) => account.normalizedUsername)
		.filter((value): value is string => Boolean(value))
	const prioritizedNames = prioritizeRecommendations(
		[...new Set(names)],
		(name) => name,
		selection,
	)
	const recommendedPlayers: ServerOverviewRecommendedPlayer[] = []

	for (const normalizedUsername of prioritizedNames) {
		if (recommendedPlayers.length >= 10) break
		const item = await buildRecommendedPlayerItem(normalizedUsername)
		if (item) recommendedPlayers.push(item)
	}

	return recommendedPlayers
}

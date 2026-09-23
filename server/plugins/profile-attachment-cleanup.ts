import { getAttachmentService } from '../utils/attachment/runtime'
import { onPostCommitEvent } from '../utils/events/post-commit'

export default defineNitroPlugin(() => {
	onPostCommitEvent('user.profile.attachment-replaced', async ({ payload }) => {
		await getAttachmentService().deleteProfileAttachmentsExcept({
			userId: payload.userId,
			purpose: payload.purpose,
			activeAttachmentId: payload.activeAttachmentId,
		})
	})
})

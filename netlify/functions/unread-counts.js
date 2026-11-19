import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { ServiceProposal, ContactMessage, Testimonial } from './utils/models.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    const auth = verifyAuth(event);
    if (!auth.authorized) return auth.response;

    const [proposalsCount, messagesCount, testimonialsCount] =
      await Promise.all([
        ServiceProposal.countDocuments({
          $or: [{ isRead: false }, { status: 'Nouveau' }],
        }).catch(() => 0),
        ContactMessage.countDocuments({ isRead: false }).catch(() => 0),
        Testimonial.countDocuments({ isRead: false }).catch(() => 0),
      ]);

    const total = proposalsCount + messagesCount + testimonialsCount;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        total,
        proposals: proposalsCount,
        messages: messagesCount,
        testimonials: testimonialsCount,
      }),
    };
  } catch (error) {
    console.error('unread-counts error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

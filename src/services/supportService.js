const pool = require('./userService').pool;

module.exports = {
  async createTicket(userId, ticketData) {
    const ticketId = `TKT_${Date.now().toString(36)}`;
    await pool.execute(
      'INSERT INTO support_tickets (ticket_id, user_id, type, title, content, images) VALUES (?, ?, ?, ?, ?, ?)',
      [ticketId, userId, ticketData.type, ticketData.title, ticketData.content, JSON.stringify(ticketData.images)]
    );
    return { ticket_id: ticketId };
  },

  async getTicketStatus(ticketId, userId) {
    const [ticket] = await pool.execute(
      'SELECT * FROM support_tickets WHERE ticket_id = ? AND user_id = ?',
      [ticketId, userId]
    );
    if (!ticket.length) throw { code: 'FORBIDDEN', message: '工单不存在或无权访问' };

    const [replies] = await pool.execute(
      'SELECT role, content, created_time AS time FROM ticket_replies WHERE ticket_id = ? ORDER BY created_time',
      [ticketId]
    );

    return {
      status: ticket[0].status,
      latest_reply: replies.length > 0 ? replies[replies.length - 1].content : null,
      replies: replies.map(reply => ({
        role: reply.role,
        content: reply.content,
        time: reply.time
      }))
    };
  }
};
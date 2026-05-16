function isDatabaseUnavailable(error) {
  return [
    'ECONNREFUSED',
    'PROTOCOL_CONNECTION_LOST',
    'ETIMEDOUT',
    'ENOTFOUND',
  ].includes(error?.code);
}

function sendDatabaseError(res, error, fallbackMessage = 'Database request failed.') {
  if (isDatabaseUnavailable(error)) {
    return res.status(503).json({
      message: 'Database unavailable. Start MySQL and try again.',
      code: 'DATABASE_UNAVAILABLE',
    });
  }

  if (error?.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      message: 'Database schema is incomplete. Run the schema setup and try again.',
      code: 'DATABASE_SCHEMA_MISSING',
    });
  }

  if (error?.code === 'ER_BAD_FIELD_ERROR') {
    return res.status(500).json({
      message: 'Database schema is out of date. Apply the latest migration and try again.',
      code: 'DATABASE_SCHEMA_OUTDATED',
    });
  }

  console.error(fallbackMessage, error);
  return res.status(500).json({
    message: fallbackMessage,
    code: 'DATABASE_ERROR',
  });
}

module.exports = {
  isDatabaseUnavailable,
  sendDatabaseError,
};

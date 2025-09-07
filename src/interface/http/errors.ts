export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Requisição inválida') {
    super(message, 400, 'BAD_REQUEST');
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Não autorizado') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Acesso negado') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = 'Conflito de dados') {
    super(message, 409, 'CONFLICT');
  }
}

export class ValidationError extends HttpError {
  constructor(message: string = 'Dados inválidos') {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Erro interno do servidor') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message: string = 'Serviço indisponível') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
  }
}

export function mapErrorToHttpStatus(error: Error): { statusCode: number; message: string; code: string } {
  if (error instanceof HttpError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code
    };
  }

  // Mapeia erros específicos do domínio
  if (error.message.includes('não encontrado')) {
    return {
      statusCode: 404,
      message: error.message,
      code: 'NOT_FOUND'
    };
  }

  if (error.message.includes('já cadastrado') || error.message.includes('já existe')) {
    return {
      statusCode: 409,
      message: error.message,
      code: 'CONFLICT'
    };
  }

  if (error.message.includes('inválido') || error.message.includes('obrigatório')) {
    return {
      statusCode: 422,
      message: error.message,
      code: 'VALIDATION_ERROR'
    };
  }

  if (error.message.includes('Timeout') || error.message.includes('indisponível')) {
    return {
      statusCode: 503,
      message: error.message,
      code: 'SERVICE_UNAVAILABLE'
    };
  }

  // Erro genérico
  return {
    statusCode: 500,
    message: 'Erro interno do servidor',
    code: 'INTERNAL_SERVER_ERROR'
  };
}

export function createErrorResponse(error: Error) {
  const { statusCode, message, code } = mapErrorToHttpStatus(error);
  
  return {
    error: {
      code,
      message,
      timestamp: new Date().toISOString()
    }
  };
}

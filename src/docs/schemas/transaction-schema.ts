const bearerSecurity = [{ bearerAuth: [] }]

const transactionBody = {
    type: 'object' as const,
    required: ['type', 'description', 'value'],
    properties: {
        type:        { type: 'string', enum: ['INCOME', 'EXPENSE'] },
        description: { type: 'string' },
        value:       { type: 'number' },
    },
}

const transactionResponse = {
    type: 'object' as const,
    properties: {
        id:          { type: 'string' },
        type:        { type: 'string' },
        description: { type: 'string' },
        value:       { type: 'number' },
        userId:      { type: 'string' },
        createdAt:   { type: 'string', format: 'date-time' },
    },
}

export const createTransactionSchema = {
    tags: ['Transações'],
    summary: 'Criar nova transação',
    security: bearerSecurity,
    body: transactionBody,
    response: {
        201: { description: 'Transação criada',  ...transactionResponse },
        401: { description: 'Não autenticado',   type: 'object', properties: { error: { type: 'string' } } },
    },
}

export const findTransactionSchema = {
    tags: ['Transações'],
    summary: 'Listar transações do usuário autenticado',
    security: bearerSecurity,
    response: {
        200: {
            description: 'Lista de transações',
            type: 'array',
            items: transactionResponse,
        },
        401: { description: 'Não autenticado', type: 'object', properties: { error: { type: 'string' } } },
    },
}

export const updateTransactionSchema = {
    tags: ['Transações'],
    summary: 'Atualizar transação por ID',
    security: bearerSecurity,
    params: {
        type: 'object',
        properties: { id: { type: 'string', description: 'ID da transação' } },
    },
    body: {
        type: 'object',
        properties: {
            type:        { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            description: { type: 'string' },
            value:       { type: 'number' },
        },
    },
    response: {
        200: { description: 'Transação atualizada',       ...transactionResponse },
        401: { description: 'Não autenticado',            type: 'object', properties: { error: { type: 'string' } } },
        404: { description: 'Transação não encontrada',   type: 'object', properties: { error: { type: 'string' } } },
    },
}

export const deleteTransactionSchema = {
    tags: ['Transações'],
    summary: 'Deletar transação por ID',
    security: bearerSecurity,
    params: {
        type: 'object',
        properties: { id: { type: 'string', description: 'ID da transação' } },
    },
    response: {
        200: { description: 'Transação deletada com sucesso', type: 'object', properties: { message: { type: 'string' } } },
        401: { description: 'Não autenticado',                type: 'object', properties: { error: { type: 'string' } } },
        404: { description: 'Transação não encontrada',       type: 'object', properties: { error: { type: 'string' } } },
    },
}

export const loginSchema = {
    tags: ['Autenticação'],
    summary: 'Login e geração de token JWT',
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email:    { type: 'string', format: 'email' },
            password: { type: 'string' },
        },
    },
    response: {
        200: {
            description: 'Token JWT gerado com sucesso',
            type: 'object',
            properties: {
                message: { type: 'string' },
                token: { type: 'string' },
            },
        },
        400: { description: 'Dados inválidos', type: 'object', properties: { error: { type: 'string' }, issues: { type: 'array' } } },
        401: { description: 'Credenciais inválidas', type: 'object', properties: { error: { type: 'string' } } },
    },
}

export const logoutSchema = {
    tags: ['Autenticação'],
    summary: 'Encerra a sessão e revoga o token atual',
    security: [{ bearerAuth: [] }],
    response: {
        200: {
            description: 'Logout realizado, token revogado',
            type: 'object',
            properties: { message: { type: 'string' } },
        },
        401: { description: 'Não autenticado', type: 'object', properties: { error: { type: 'string' } } },
    },
}

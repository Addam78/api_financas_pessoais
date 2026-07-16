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
        401: { description: 'Credenciais inválidas', type: 'object', properties: { message: { type: 'string' } } },
    },
}

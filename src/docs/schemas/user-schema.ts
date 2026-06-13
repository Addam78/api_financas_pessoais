export const createUserSchema = {
    tags: ['Usuários'],
    summary: 'Cadastrar novo usuário',
    body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
            name:     { type: 'string' },
            email:    { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
        },
    },
    response: {
        201: {
            description: 'Usuário criado com sucesso',
            type: 'object',
            properties: {
                id:    { type: 'string' },
                name:  { type: 'string' },
                email: { type: 'string' },
            },
        },
        400: { description: 'Dados inválidos',       type: 'object', properties: { message: { type: 'string' } } },
        409: { description: 'E-mail já cadastrado',  type: 'object', properties: { message: { type: 'string' } } },
    },
}

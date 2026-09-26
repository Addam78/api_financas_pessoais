export const healthSchema = {
    tags: ['Sistema'],
    summary: 'Verifica se a API está no ar',
    response: {
        200: {
            description: 'API operacional',
            type: 'object',
            properties: { status: { type: 'string', example: 'ok' } },
        },
    },
}

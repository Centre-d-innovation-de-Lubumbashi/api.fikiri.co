export const paginate = (page: number, limit: number) => {
    return {
        offset: page ? (page - 1) * limit : 0,
        limit,
    };
};
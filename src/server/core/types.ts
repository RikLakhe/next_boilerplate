export interface IBaseEntity {
    id: string | number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBaseService<T extends IBaseEntity> {
    findAll(): Promise<T[]>;
    findById(id: string | number): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    delete(id: string | number): Promise<boolean>;
}

export interface IBaseRepository<T extends IBaseEntity> {
    findAll(): Promise<T[]>;
    findById(id: string | number): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    delete(id: string | number): Promise<boolean>;
}
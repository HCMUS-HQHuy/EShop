import express from 'express';
import { Server, DefaultEventsMap } from 'socket.io';
import { UserInfor } from './index.types';

export enum SORT_ATTRIBUTES {
    NAME = 'name',
    CREATED_AT = 'created_at',
};

export enum SORT_ORDERS {
    ASC = 'asc',
    DESC = 'desc',
}

export interface ValidationResult {
    valid: boolean;
    errors: Partial<Record<string, string>>;
}

export const regex = {
    phone: /^\+?[0-9]{10,15}$/
}

export enum SOCKET_NAMESPACE {
  USER = '/user',
  SELLER = '/seller',
  ADMIN = '/admin',
}

export interface RequestCustom extends express.Request {
    user?: UserInfor;
    io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}
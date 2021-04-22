/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */


import { NextFunction, Request, Response } from 'express'
import { oAuthService } from '../index'


export const ensureLoggedIn = async (req: Request, res: Response, next: NextFunction) => {

    let token
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }

    console.log('Bearer token: ', token)
    next()
}

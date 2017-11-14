/**
 * Created by Alexandre on 12/06/2017.
 */
import { Injectable } from '@angular/core';
import {Message} from "../_models/messages/message";

@Injectable()
export class ConversationService {
    message :Message;
}
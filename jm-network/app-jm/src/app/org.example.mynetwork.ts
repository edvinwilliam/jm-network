import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.example.mynetwork{
   export enum Type {
      II,
      IF,
      EE,
      EP,
      EB,
      ET,
      MB,
      MK,
      DI,
      DK,
      KU,
      TI,
      MR,
   }
   export class Document extends Asset {
      title: string;
      description: string;
      type: Type;
      status: string;
      price: number;
      score: number;
      downloader: User[];
      downloaded: number;
      citedDocument: Document[];
      cited: number;
      author: User[];
      authorCounter: number;
      progressReviewer: User[];
      reviewer: User[];
      feedback: string[];
      progressCounter: number;
      reviewCounter: number;
   }
   export class User extends Participant {
      email: string;
      firstName: string;
      lastName: string;
      field: Type;
      ownedDocument: Document[];
      owned: number;
      downloadedDocument: Document[];
      download: number;
      score: number;
      wallet: number;
   }
   export class Upload extends Transaction {
      document: Document;
      author: User;
   }
   export class Review extends Transaction {
      document: Document;
      reviewer: User;
   }
   export class Feedback extends Transaction {
      document: Document;
      reviewer: User;
      feedback: string;
   }
   export class Download extends Transaction {
      document: Document;
      downloader: User;
   }
   export class Cite extends Transaction {
      document: Document;
      cite: Document;
   }
   export class UserNotification extends Event {
      document: Document;
      status: string;
   }
   export class CiteNotification extends Event {
      document: Document;
      citedDocument: Document;
      author: User[];
      status: string;
   }
// }

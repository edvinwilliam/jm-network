/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from './User.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-user',
  templateUrl: './User.component.html',
  styleUrls: ['./User.component.css'],
  providers: [UserService]
})
export class UserComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  email = new FormControl('', Validators.required);
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  field = new FormControl('', Validators.required);
  ownedDocument = new FormControl('', Validators.required);
  owned = new FormControl('', Validators.required);
  downloadedDocument = new FormControl('', Validators.required);
  download = new FormControl('', Validators.required);
  score = new FormControl('', Validators.required);
  wallet = new FormControl('', Validators.required);


  constructor(public serviceUser: UserService, fb: FormBuilder) {
    this.myForm = fb.group({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      field: this.field,
      ownedDocument: this.ownedDocument,
      owned: this.owned,
      downloadedDocument: this.downloadedDocument,
      download: this.download,
      score: this.score,
      wallet: this.wallet
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceUser.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.example.mynetwork.User',
      'email': this.email.value,
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'field': this.field.value,
      'ownedDocument': this.ownedDocument.value,
      'owned': this.owned.value,
      'downloadedDocument': this.downloadedDocument.value,
      'download': this.download.value,
      'score': this.score.value,
      'wallet': this.wallet.value
    };

    this.myForm.setValue({
      'email': null,
      'firstName': null,
      'lastName': null,
      'field': null,
      'ownedDocument': null,
      'owned': null,
      'downloadedDocument': null,
      'download': null,
      'score': null,
      'wallet': null
    });

    return this.serviceUser.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'email': null,
        'firstName': null,
        'lastName': null,
        'field': null,
        'ownedDocument': null,
        'owned': null,
        'downloadedDocument': null,
        'download': null,
        'score': null,
        'wallet': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.example.mynetwork.User',
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'field': this.field.value,
      'ownedDocument': this.ownedDocument.value,
      'owned': this.owned.value,
      'downloadedDocument': this.downloadedDocument.value,
      'download': this.download.value,
      'score': this.score.value,
      'wallet': this.wallet.value
    };

    return this.serviceUser.updateParticipant(form.get('email').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceUser.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceUser.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'email': null,
        'firstName': null,
        'lastName': null,
        'field': null,
        'ownedDocument': null,
        'owned': null,
        'downloadedDocument': null,
        'download': null,
        'score': null,
        'wallet': null
      };

      if (result.email) {
        formObject.email = result.email;
      } else {
        formObject.email = null;
      }

      if (result.firstName) {
        formObject.firstName = result.firstName;
      } else {
        formObject.firstName = null;
      }

      if (result.lastName) {
        formObject.lastName = result.lastName;
      } else {
        formObject.lastName = null;
      }

      if (result.field) {
        formObject.field = result.field;
      } else {
        formObject.field = null;
      }

      if (result.ownedDocument) {
        formObject.ownedDocument = result.ownedDocument;
      } else {
        formObject.ownedDocument = null;
      }

      if (result.owned) {
        formObject.owned = result.owned;
      } else {
        formObject.owned = null;
      }

      if (result.downloadedDocument) {
        formObject.downloadedDocument = result.downloadedDocument;
      } else {
        formObject.downloadedDocument = null;
      }

      if (result.download) {
        formObject.download = result.download;
      } else {
        formObject.download = null;
      }

      if (result.score) {
        formObject.score = result.score;
      } else {
        formObject.score = null;
      }

      if (result.wallet) {
        formObject.wallet = result.wallet;
      } else {
        formObject.wallet = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'email': null,
      'firstName': null,
      'lastName': null,
      'field': null,
      'ownedDocument': null,
      'owned': null,
      'downloadedDocument': null,
      'download': null,
      'score': null,
      'wallet': null
    });
  }
}

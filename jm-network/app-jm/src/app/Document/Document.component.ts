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
import { DocumentService } from './Document.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-document',
  templateUrl: './Document.component.html',
  styleUrls: ['./Document.component.css'],
  providers: [DocumentService]
})
export class DocumentComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  title = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  score = new FormControl('', Validators.required);
  downloader = new FormControl('', Validators.required);
  downloaded = new FormControl('', Validators.required);
  citedDocument = new FormControl('', Validators.required);
  cited = new FormControl('', Validators.required);
  author = new FormControl('', Validators.required);
  authorCounter = new FormControl('', Validators.required);
  progressReviewer = new FormControl('', Validators.required);
  reviewer = new FormControl('', Validators.required);
  feedback = new FormControl('', Validators.required);
  progressCounter = new FormControl('', Validators.required);
  reviewCounter = new FormControl('', Validators.required);

  constructor(public serviceDocument: DocumentService, fb: FormBuilder) {
    this.myForm = fb.group({
      title: this.title,
      description: this.description,
      type: this.type,
      status: this.status,
      price: this.price,
      score: this.score,
      downloader: this.downloader,
      downloaded: this.downloaded,
      citedDocument: this.citedDocument,
      cited: this.cited,
      author: this.author,
      authorCounter: this.authorCounter,
      progressReviewer: this.progressReviewer,
      reviewer: this.reviewer,
      feedback: this.feedback,
      progressCounter: this.progressCounter,
      reviewCounter: this.reviewCounter
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDocument.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.Document',
      'title': this.title.value,
      'description': this.description.value,
      'type': this.type.value,
      'status': this.status.value,
      'price': this.price.value,
      'score': this.score.value,
      'downloader': this.downloader.value,
      'downloaded': this.downloaded.value,
      'citedDocument': this.citedDocument.value,
      'cited': this.cited.value,
      'author': this.author.value,
      'authorCounter': this.authorCounter.value,
      'progressReviewer': this.progressReviewer.value,
      'reviewer': this.reviewer.value,
      'feedback': this.feedback.value,
      'progressCounter': this.progressCounter.value,
      'reviewCounter': this.reviewCounter.value
    };

    this.myForm.setValue({
      'title': null,
      'description': null,
      'type': null,
      'status': null,
      'price': null,
      'score': null,
      'downloader': null,
      'downloaded': null,
      'citedDocument': null,
      'cited': null,
      'author': null,
      'authorCounter': null,
      'progressReviewer': null,
      'reviewer': null,
      'feedback': null,
      'progressCounter': null,
      'reviewCounter': null
    });

    return this.serviceDocument.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'title': null,
        'description': null,
        'type': null,
        'status': null,
        'price': null,
        'score': null,
        'downloader': null,
        'downloaded': null,
        'citedDocument': null,
        'cited': null,
        'author': null,
        'authorCounter': null,
        'progressReviewer': null,
        'reviewer': null,
        'feedback': null,
        'progressCounter': null,
        'reviewCounter': null
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


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.Document',
      'description': this.description.value,
      'type': this.type.value,
      'status': this.status.value,
      'price': this.price.value,
      'score': this.score.value,
      'downloader': this.downloader.value,
      'downloaded': this.downloaded.value,
      'citedDocument': this.citedDocument.value,
      'cited': this.cited.value,
      'author': this.author.value,
      'authorCounter': this.authorCounter.value,
      'progressReviewer': this.progressReviewer.value,
      'reviewer': this.reviewer.value,
      'feedback': this.feedback.value,
      'progressCounter': this.progressCounter.value,
      'reviewCounter': this.reviewCounter.value
    };

    return this.serviceDocument.updateAsset(form.get('title').value, this.asset)
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


  deleteAsset(): Promise<any> {

    return this.serviceDocument.deleteAsset(this.currentId)
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

    return this.serviceDocument.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'title': null,
        'description': null,
        'type': null,
        'status': null,
        'price': null,
        'score': null,
        'downloader': null,
        'downloaded': null,
        'citedDocument': null,
        'cited': null,
        'author': null,
        'authorCounter': null,
        'progressReviewer': null,
        'reviewer': null,
        'feedback': null,
        'progressCounter': null,
        'reviewCounter': null
      };

      if (result.title) {
        formObject.title = result.title;
      } else {
        formObject.title = null;
      }

      if (result.description) {
        formObject.description = result.description;
      } else {
        formObject.description = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.status) {
        formObject.status = result.status;
      } else {
        formObject.status = null;
      }

      if (result.price) {
        formObject.price = result.price;
      } else {
        formObject.price = null;
      }

      if (result.score) {
        formObject.score = result.score;
      } else {
        formObject.score = null;
      }

      if (result.downloader) {
        formObject.downloader = result.downloader;
      } else {
        formObject.downloader = null;
      }

      if (result.downloaded) {
        formObject.downloaded = result.downloaded;
      } else {
        formObject.downloaded = null;
      }

      if (result.citedDocument) {
        formObject.citedDocument = result.citedDocument;
      } else {
        formObject.citedDocument = null;
      }

      if (result.cited) {
        formObject.cited = result.cited;
      } else {
        formObject.cited = null;
      }

      if (result.author) {
        formObject.author = result.author;
      } else {
        formObject.author = null;
      }

      if (result.authorCounter) {
        formObject.authorCounter = result.authorCounter;
      } else {
        formObject.authorCounter = null;
      }

      if (result.progressReviewer) {
        formObject.progressReviewer = result.progressReviewer;
      } else {
        formObject.progressReviewer = null;
      }

      if (result.reviewer) {
        formObject.reviewer = result.reviewer;
      } else {
        formObject.reviewer = null;
      }

      if (result.feedback) {
        formObject.feedback = result.feedback;
      } else {
        formObject.feedback = null;
      }

      if (result.progressCounter) {
        formObject.progressCounter = result.progressCounter;
      } else {
        formObject.progressCounter = null;
      }

      if (result.reviewCounter) {
        formObject.reviewCounter = result.reviewCounter;
      } else {
        formObject.reviewCounter = null;
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
      'title': null,
      'description': null,
      'type': null,
      'status': null,
      'price': null,
      'score': null,
      'downloader': null,
      'downloaded': null,
      'citedDocument': null,
      'cited': null,
      'author': null,
      'authorCounter': null,
      'progressReviewer': null,
      'reviewer': null,
      'feedback': null,
      'progressCounter': null,
      'reviewCounter': null
      });
  }

}

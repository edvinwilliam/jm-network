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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { DocumentComponent } from './Document/Document.component';

import { UserComponent } from './User/User.component';

import { UploadComponent } from './Upload/Upload.component';
import { ReviewComponent } from './Review/Review.component';
import { FeedbackComponent } from './Feedback/Feedback.component';
import { DownloadComponent } from './Download/Download.component';
import { CiteComponent } from './Cite/Cite.component';

import { AllTransactionsComponent } from './AllTransactions/AllTransactions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'About', component: AboutComponent },

  { path: 'Document', component: DocumentComponent },
  
  { path: 'User', component: UserComponent },
  
  { path: 'Upload', component: UploadComponent },
  { path: 'Review', component: ReviewComponent },
  { path: 'Feedback', component: FeedbackComponent },
  { path: 'Download', component: DownloadComponent },
  { path: 'Cite', component: CiteComponent },
  
  { path: 'AllTransactions', component: AllTransactionsComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }

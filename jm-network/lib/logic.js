/**
 * Track the upload of a document
 * @param {org.example.mynetwork.Upload} upload - the document to be uploaded
 * @transaction
 */
async function uploadDocument(upload) {
  	// Assign Author, Status & Price
  	if(upload.document.authorCounter == 0) {
    	
      	upload.document.author = [];
  		upload.document.status = 'UPLOADED';
      	upload.document.author[upload.document.authorCounter] = upload.author;
      	upload.document.price = (Math.ceil(upload.document.author[upload.document.authorCounter].score/100))*1000;
      	upload.document.authorCounter++;
  		
    } else {
    	upload.document.author[upload.document.authorCounter] = upload.author;
  		upload.document.authorCounter++;
      	
      	// Updated Price
        var authorLength = upload.document.author.length;
        for (var i = 0; i < authorLength; i++) {
            upload.document.price = upload.document.price + (Math.ceil(upload.document.author[i].score/100))*1000;
        }
        upload.document.price = upload.document.price/authorLength;
    }
  
  	// Initial Citer
  	if(upload.document.cited == 0) {
    	upload.document.citedDocument = [];
    }
  
  	// Initial Downloader
  	if(upload.document.downloaded == 0) {
    	upload.document.downloader = [];
    }
  
  	// Initial Reviewer
  	if(upload.document.reviewCounter == 0) {
    	upload.document.reviewer = [];
  		upload.document.progressReviewer = [];
  		upload.document.feedback = [];
    }
  
  	// Initial Owned Document
  	if(upload.author.owned == 0) {
    	upload.author.ownedDocument = [];
      	upload.author.ownedDocument[upload.author.owned] = upload.document;
      	upload.author.owned++;
    } else {
    	upload.author.ownedDocument[upload.author.owned] = upload.document;
      	upload.author.owned++;
    }
  
  	// Initial Downloaded Document
  	if(upload.author.download == 0) {
     	upload.author.downloadedDocument = []; 
    }
  
  	let assetRegistry = await getAssetRegistry('org.example.mynetwork.Document');
  	let participantRegistry = await getParticipantRegistry('org.example.mynetwork.User')
  	
  	// emit a notification that an upload has occurred
  	let userNotification = getFactory().newEvent('org.example.mynetwork', 'UserNotification');
    userNotification.document = upload.document;
  	userNotification.status = upload.document.status;
    emit(userNotification);
  	
  	// persist the state of the commodity
    await assetRegistry.update(upload.document);
  	await participantRegistry.update(upload.author);
}

/**
 * Track the review of a document
 * @param {org.example.mynetwork.Review} review - the document to be reviewed
 * @transaction
 */
async function reviewDocument(review) {
  	// Put progressReviewer to Array of Reviewer
  	review.document.progressReviewer[review.document.progressCounter] = review.reviewer;
  	review.document.status = 'PROGRESS';
  	review.document.progressCounter++;
    
  	let assetRegistry = await getAssetRegistry('org.example.mynetwork.Document');
  
  	// emit a notification that an upload has occurred
  	let userNotification = getFactory().newEvent('org.example.mynetwork', 'UserNotification');
    userNotification.document = review.document;
  	userNotification.status = review.document.status;
    emit(userNotification);
  	
  	// persist the state of the commodity
    await assetRegistry.update(review.document);
}

/**
 * Track the review of a document
 * @param {org.example.mynetwork.Feedback} feedback - feedback of document from reviewer
 * @transaction
 */
async function feedbackDocument(feedback) {
  	// Delete element from Progress Reviewer Array
  	for (var i = 0; i < feedback.document.progressReviewer.length; i++) {
    	if (feedback.document.progressReviewer[i] == feedback.reviewer){
        	feedback.document.progressReviewer.splice(i,1);
          	feedback.document.progressCounter--;
        }
	}
  	
  	// Put progressReviewer to Array of Reviewer
  	feedback.document.reviewer[feedback.document.reviewCounter] = feedback.reviewer;
  	// Put feedback to Array of Feedback
  	feedback.document.feedback[feedback.document.reviewCounter] = feedback.feedback;
  	
  	// Iterate document review process
  	feedback.document.reviewCounter++;
  
  	// Renew the document status
  	feedback.document.status = 'REVIEWED' + feedback.document.reviewCounter;
    
  	let assetRegistry = await getAssetRegistry('org.example.mynetwork.Document');
  
  	// emit a notification that an upload has occurred
  	let userNotification = getFactory().newEvent('org.example.mynetwork', 'UserNotification');
    userNotification.document = feedback.document;
  	userNotification.status = feedback.document.status;
    emit(userNotification);
  	
  	// persist the state of the commodity
    await assetRegistry.update(feedback.document);
}

/**
 * Track the review of a document
 * @param {org.example.mynetwork.Download} download - track downloaded document
 * @transaction
 */
async function downloadDocument(download) {
  	// Iterate document download process
  	download.document.downloader[download.document.downloaded] = download.downloader;
  	download.document.downloaded++;
  
  	// Add document downloaded
  	download.downloader.downloadedDocument[download.downloader.download] = download.document;
  	download.downloader.download++;
  
  	// Appretiation for Author and Reviewer
  	var authorPrice = (download.document.price * 0.7)/download.document.author.length;
  	var reviewerPrice = (download.document.price * 0.3)/download.document.reviewer.length;
  	for (var i = 0; i < download.document.author.length; i++) {
    	download.document.author[i].wallet = download.document.author[i].wallet + authorPrice;
	}
  	for (var i = 0; i < download.document.reviewer.length; i++) {
    	download.document.reviewer[i].wallet = download.document.reviewer[i].wallet + reviewerPrice;
	}
  
  	// Price adjustment based on download amount
  	if(download.document.downloaded < 5){
   		download.document.price = download.document.price;
    } else if(download.document.downloaded == 5){
     	download.document.price = download.document.price + 10;
	} else if(download.document.downloaded % 5 == 0){
		download.document.price = download.document.price + 10;
    } else {
     	download.document.price = download.document.price; 
    }
  
  	let assetRegistry = await getAssetRegistry('org.example.mynetwork.Document');
  	let participantRegistry = await getParticipantRegistry('org.example.mynetwork.User');
  
  	// emit a notification that an upload has occurred
  	let userNotification = getFactory().newEvent('org.example.mynetwork', 'UserNotification');
    userNotification.document = download.document;
  	userNotification.status = download.document.status;
    emit(userNotification);
  	
  	// persist the state of the commodity
    await assetRegistry.update(download.document);
  	await participantRegistry.update(download.downloader);
  	for (var i = 0; i < download.document.author.length; i++) {
    	await participantRegistry.update(download.document.author[i]);
	}
  	for (var i = 0; i < download.document.reviewer.length; i++) {
    	await participantRegistry.update(download.document.reviewer[i]);
	}
}

/**
 * Track the review of a document
 * @param {org.example.mynetwork.Cite} cite - track cited document
 * @transaction
 */
async function citeDocument(cite) {
  	cite.document.citedDocument[cite.document.cited] = cite.cite;
  	cite.document.cited++;
   	
  	// Score for author and reviewer
  	for (var i = 0; i < cite.document.author.length; i++) {
    	cite.document.author[i].score++;
	}
  	for (var i = 0; i < cite.document.reviewer.length; i++) {
    	cite.document.reviewer[i].score = cite.document.reviewer[i].score + 0.5;
	}
  
  	// Score adjustment based on cited amount
  	if(cite.document.cited < 5){
   		cite.document.score = cite.document.score;
    } else if(cite.document.cited == 5){
     	cite.document.score = cite.document.score + 10;
	} else if(cite.document.cited % 5 == 0){
		cite.document.score = cite.document.score + 10;
    } else {
     	cite.document.score = cite.document.score; 
    }	
  
    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Document');
  	let participantRegistry = await getParticipantRegistry('org.example.mynetwork.User');
  
  	// emit a notification that an upload has occurred
  	let citeNotification = getFactory().newEvent('org.example.mynetwork', 'CiteNotification');
    citeNotification.document = cite.document;
  	citeNotification.citedDocument = cite.document.citedDocument[cite.document.cited - 1];
  	citeNotification.author = cite.document.citedDocument[cite.document.cited - 1].author;
  	citeNotification.status = cite.document.status;
    emit(citeNotification);
  	
  	// persist the state of the commodity
    await assetRegistry.update(cite.document);
  	for (var i = 0; i < cite.document.author.length; i++) {
      	await participantRegistry.update(cite.document.author[i]);
	}
  	for (var i = 0; i < cite.document.reviewer.length; i++) {
    	await participantRegistry.update(cite.document.reviewer[i]);
	}
}
/**
 * Track the upload of a document
 * @param {org.example.mynetwork.Upload} upload - the document to be uploaded
 * @transaction
 */
async function uploadDocument(upload) {
    // The relationships in the transaction are automatically resolved.
    // This means that the asset can be accessed in the transaction instance.
    let document = upload.document;
    // The relationships are fully or recursively resolved, so you can also
    // access nested relationships. This means that you can also access the
    // owner of the asset.
    let owner = upload.document.owner;
}

/**
 * Track the review of a document
 * @param {org.example.mynetwork.Review} review - the document to be reviewed
 * @transaction
 */
async function reviewDocument(review) {
  	review.document.reviewer = review.reviewer;
  	review.document.status = 'PROGRESS';
  	review.document.reviewCounter++;
    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Document');
    await assetRegistry.update(review.document);
}

/**
 * Track the review of a document
 * @param {org.example.mynetwork.Feedback} feedback - feedback of document from reviewer
 * @transaction
 */
async function feedbackDocument(feedback) {
  	feedback.document.reviewer = feedback.document.owner;
  	feedback.document.status = 'REVIEWED' + feedback.document.reviewCounter;
  	feedback.document.feedback = feedback.document.feedback + ' #' + feedback.document.reviewCounter + ' ' + feedback.feedback;
    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Document');
    await assetRegistry.update(feedback.document);
}

/**
 * Track the review of a document
 * @param {org.example.mynetwork.Download} download - track download document
 * @transaction
 */
async function downloadDocument(download) {
  	download.document.download++;
   	download.document.price = download.document.price + 10;
    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Document');
    await assetRegistry.update(download.document);
}
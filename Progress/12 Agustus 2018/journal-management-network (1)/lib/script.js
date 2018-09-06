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
  	review.document.reviewer = review.reviewer
    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Document');
    await assetRegistry.update(review.document);
}
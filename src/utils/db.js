import mongoose from 'mongoose'

const connection = {};

async function connect() {
  if(connection.isConnected) {
    console.log('already connected');
    return;
  }
  if(mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if(connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log('new connection');
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if(connection.isConnected) {
    if(process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    }else {
      console.log('not disconnected');
    }
  }
}

function convertDocToObject(doc) {
  doc._id = doc._id.toString();
  doc.images.forEach(img => {
    img._id = img._id.toString();
    img.createdAt = img.createdAt.toString();
    img.updatedAt = img.updatedAt.toString();
  });
  if(doc.stores) {
    doc.stores.forEach(store => {
      store._id = store._id.toString();
      store.createdAt = store.createdAt.toString();
      store.updatedAt = store.updatedAt.toString();
    });
  }
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

function convertCatToObject(doc) {
  doc._id = doc._id.toString();
  doc.subCategory.forEach(sub => {
    sub._id = sub._id.toString();
    sub.createdAt = sub.createdAt.toString();
    sub.updatedAt = sub.updatedAt.toString();
  });
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObject, convertCatToObject };
export default db;
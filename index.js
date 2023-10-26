import weaviate from 'weaviate-ts-client';
import { readFileSync, readdirSync, writeFileSync } from 'fs'

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

// const schemaRes = await client.schema.getter().do();

//only run once
// const schemaConfig = {
//   'class': 'Meme',
//   'vectorizer': 'img2vec-neural',
//   'vectorIndexType': 'hnsw',
//   'moduleConfig': {
//     'img2vec-neural': {
//       'imageFields': [
//         'image'
//       ]
//     }
//   },
//   'properties': [
//     {
//       'name': 'image',
//       'dataType': ['blob']
//     },
//     {
//       'name': 'text',
//       'dataType': ['string']
//     }
//   ]
// }

// await client.schema
//   .classCreator()
//   .withClass(schemaConfig)
//   .do();




const trainImage = async () => {
  //train
  const images = readdirSync('./trains')
  const promises = images.map(image => {
    console.log(`train ${image}`)
    const img = readFileSync(`./trains/${image}`);
    const b64 = Buffer.from(img).toString('base64');
    return client.data.creator()
      .withClassName('Meme')
      .withProperties({
        image: b64,
        text: 'meme'
      })
      .do();
  })

  await Promise.all(promises)
}

const findImage = async (source) => {
  const resImage = await client.graphql.get()
    .withClassName('Meme')
    .withFields(['image'])
    .withNearImage({ image: source })
    .withLimit(1)
    .do();

  // Write result to filesystem
  const result = resImage.data.Get.Meme[0].image;
  writeFileSync('./result.jpg', result, 'base64');
}


trainImage()
const source = Buffer.from(readFileSync('./test.jpg')).toString('base64');
findImage(source)

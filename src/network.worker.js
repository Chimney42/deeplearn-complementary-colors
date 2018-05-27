import Data from './data'
import Network from './network';
const network = new Network();
network.setupNetwork();
network.setData(new Data());

const trainIfNeeded = (start) => {
    if (!start) {
        console.log('train');
        return network.train(5)
    } else {
        return Promise.resolve({loss: 0, accuracy: 0})
    }
};

onmessage = function(e) {
    let loss;
    let accuracy;
    let input;

    return trainIfNeeded(e.data[0])
        .then((result) => {
            console.log('training result', result);
            loss = result.loss;
            accuracy = result.accuracy;

            input = Data.normalize(e.data[1]);
            return network.predict(input)
        })
        .then(prediction => {
            console.log('prediction', prediction);
            input = Data.denormalize(input);
            prediction = Data.denormalize(prediction);
            postMessage({input, prediction, loss});
        })
        .catch(err => {
            console.log('error', err);
        })

};


const { Kafka } = require('kafkajs');
const fs = require('fs')

const boostrapServers = [
    "vm-kafka-test01.ds.strp.tinkoff.cloud:9093",
    "vm-kafka-test02.ds.strp.tinkoff.cloud:9093",
    "vm-kafka-test03.ds.strp.tinkoff.cloud:9093",
    "vm-kafka-test04.ds.strp.tinkoff.cloud:9093",
    "vm-kafka-test05.m1.strp.tinkoff.cloud:9093",
    "vm-kafka-test06.m1.strp.tinkoff.cloud:9093",
    "vm-kafka-test07.m1.strp.tinkoff.cloud:9093"
    ]

const kafka = new Kafka( {
    clientId: 'spd-kafka-sa',
    brokers: boostrapServers.map(broker => broker.trim()),
    connectionTimeout: 3000,
    ssl: {
        rejectUnauthorized: false,
        // ca: fs.readFileSync('./cert-ssl/test/ssl.ca.pem', 'utf-8'),
    },
    sasl: {
        mechanism: 'scram-sha-512',
        username: "spd-kafka",
        password: "pjJCO80olj1Xy5nM5uY1"
    }
} );

const consumer = kafka.consumer( { groupId: 'spd-kafka.atlassian.jira1.issuecreate.1' } );

const run = async () => {
    await consumer.connect();
    await consumer.subscribe( { topic: 'atlassian.jira1.issueupdate', fromBeginning: true } );
    // await consumer.subscribe( { topic: 'atlassian.jira1.issuecreate', fromBeginning: true } );

    await consumer.run( {
        eachMessage: async ( { topic, partition, message } ) => {
            console.log( {
                partition,
                offset: message.offset,
                value: message.value?.toString(),
                headers: message.headers,
                key: message.key.toString()
            } );
        },
    } );
};

run().catch(console.error);

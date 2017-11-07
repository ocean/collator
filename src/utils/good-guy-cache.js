import RedisCache from 'good-guy-cache-redis';
// import Redis from 'redis';

export default function (ttl) {
  // quick short cut for this now
  return new RedisCache({ ttl });

  // change to below for good-guy-http built-in in-memory caching
  // return undefined;

  // ====================================
  // ARGHARGAHRGARGHARG FUCK KNOWS WHY NONE OF THIS WORKS !!!!??!?!?!

  // try {
  //   return new RedisCache({ ttl });
  // } catch (error) {
  //   return undefined;
  // }

  // try {
  //   const client = Redis.createClient(6379, '127.0.0.1', {
  //     retry_strategy: (options) => {
  //       if (options.error && options.error.code === 'ECONNREFUSED') {
  //         return new Error('Connection refused');
  //       }
  //       return new Error('Different error happened');
  //     },
  //   });
  //   client.on('connect', () => {
  //     console.log('Connected to Redis');
  //     console.log('connected?', client.connected);
  //     return new RedisCache({ ttl });
  //   });
  //   client.on('error', () => {
  //     // throw new Error('Some error');
  //     return undefined;
  //   });
  // } catch (error) {
  //   console.log('Error connecting to Redis - using LRUCache');
  //   console.dir(error);
  //   return undefined;
  // }

  // const client = Redis.createClient(6379, '127.0.0.1', {
  //   retry_strategy: (options) => {
  //     if (options.error && options.error.code === 'ECONNREFUSED') {
  //       return new Error('Connection refused');
  //     }
  //     return new Error('Different error happened');
  //   },
  // });

  // client.on('connect', () => {
  //   console.log('Connected to Redis');
  //   console.log('connected?', client.connected);
  //   // console.dir(client.server_info);
  //   // client.set('test-key', 'test-value', (err) => {
  //   //   if (err) {
  //   //     console.log('Returning undefined - using LRUCache');
  //   //     cache = undefined;
  //   //     return cache;
  //   //   }
  //   //   console.log('Returning RedisCache for use');
  //   //   cache = new RedisCache({ ttl });
  //   //   return cache;
  //   // });
  //   // cache = new RedisCache({ ttl });
  //   // return cache;
  //   return new RedisCache({ ttl });
  // });

  // client.on('error', () => {
  //   console.log('Error connecting to Redis - using LRUCache');
  //   // cache = undefined;
  //   // return cache;
  //   return undefined;
  // });
  // client.set('test-key', 'test-value', (err) => {
  //   if (err) {
  //     return undefined;
  //   }
  //   return new RedisCache({ ttl });
  // });
  // console.dir(client.server_info);
  // if (client.send_command('INFO')) {
  //   return new RedisCache({ ttl });
  // }
}

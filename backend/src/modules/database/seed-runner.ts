import { AppDataSource } from './data-source';
import { runSeed } from './seed';

AppDataSource.initialize()
  .then(async (dataSource) => {
    await runSeed(dataSource);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCriptHashProvider from './HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCriptHashProvider);

import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    const payloadReturn = await payload;
    return payloadReturn;
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    const payloadReturn = (await payload) === hashed;

    return payloadReturn;
  }
}

export default FakeHashProvider;

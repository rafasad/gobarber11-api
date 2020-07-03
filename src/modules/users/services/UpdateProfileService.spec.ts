import AppError from '@shared/error/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'abc123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John new',
      email: 'johndoenew@example.com',
    });

    expect(updatedUser.name).toBe('John new');
    expect(updatedUser.email).toBe('johndoenew@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'abc123456',
    });

    const user = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: 'abc123456',
    });

    updateProfileService.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johndoe@example.com',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johndoe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'abc123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John new',
      email: 'johndoenew@example.com',
      old_password: 'abc123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'abc123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John new',
        email: 'johndoenew@example.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'abc123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John new',
        email: 'johndoenew@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from non-existing user', async () => {
    expect(
      updateProfileService.execute({
        user_id: 'non-existing-user-id',
        email: 'johndoe@test.com',
        name: 'John Doe',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

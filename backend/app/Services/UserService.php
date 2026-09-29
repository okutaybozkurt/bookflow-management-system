<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Exceptions\ConflictException;
use App\Models\User;

/** Yönetici tarafından yapılan kullanıcı yönetimi. */
class UserService
{
    public function __construct(private readonly ActivityLogger $logger) {}

    public function create(array $data): User
    {
        $user = User::create($data);
        $this->logger->log('created', "Kullanıcı eklendi: {$user->email}", $user, ['role' => $user->role->value]);

        return $user;
    }

    public function update(User $user, array $data, User $actor): User
    {
        if ($user->is($actor) && isset($data['role']) && $data['role'] !== $user->role->value) {
            throw new ConflictException('Kendi rolünüzü değiştiremezsiniz.');
        }

        $user->fill($data);
        $changed = array_keys($user->getDirty());
        $user->save();

        $this->logger->log('updated', "Kullanıcı güncellendi: {$user->email}", $user, ['fields' => $changed]);

        return $user;
    }

    public function delete(User $user, User $actor): void
    {
        if ($user->is($actor)) {
            throw new ConflictException('Kendi hesabınızı silemezsiniz.');
        }

        // Aktif oturumlar da kapatılır; kayıt soft delete ile saklanır.
        $user->tokens()->delete();
        $user->delete();

        $this->logger->log('deleted', "Kullanıcı silindi: {$user->email}", $user);
    }

    public function restore(User $user): User
    {
        $user->restore();
        $this->logger->log('restored', "Kullanıcı geri getirildi: {$user->email}", $user);

        return $user;
    }
}

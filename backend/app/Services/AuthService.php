<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(private readonly ActivityLogger $logger) {}

    /** Kayıt olan herkes müşteridir; admin rolü dışarıdan atanamaz. */
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'role' => UserRole::Customer,
        ]);

        $this->logger->log('registered', 'Yeni kullanıcı kaydoldu', $user, userId: $user->id);

        return [$user, $this->issueToken($user)];
    }

    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        // Kullanıcı yok / şifre yanlış aynı mesajı döner (hesap varlığı sızmasın).
        if (! $user || ! Hash::check($password, $user->password)) {
            throw new AuthenticationException('E-posta veya şifre hatalı.');
        }

        $this->logger->log('login', 'Kullanıcı giriş yaptı', $user, userId: $user->id);

        return [$user, $this->issueToken($user)];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
        $this->logger->log('logout', 'Kullanıcı çıkış yaptı', $user, userId: $user->id);
    }

    public function updateProfile(User $user, array $data): User
    {
        $user->fill(collect($data)->only(['name', 'email', 'phone', 'address'])->all());

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        $changed = array_keys($user->getDirty());
        $user->save();

        $this->logger->log('updated', 'Profil güncellendi', $user, ['fields' => $changed]);

        return $user;
    }

    private function issueToken(User $user): string
    {
        return $user->createToken('api')->plainTextToken;
    }
}

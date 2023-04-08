<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use function Pest\Faker\fake;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

it('logs in a user', function () {
    $password = fake()->password;

    $user = User::factory()->create([
        'password' => $password,
    ]);

    $response = postJson(route('v1.auth.login'), [
        'email' => $user->email,
        'password' => $password,
    ]);

    $response->assertOk();
})->group('v1.auth');

it('fails to log in a user', function () {
    $faker = fake();

    $password = $faker->password;

    $user = User::factory()->create([
        'password' => $password,
    ]);

    $response = postJson(route('v1.auth.login'), [
        'email' => $user->email,
        'password' => $faker->password,
    ]);

    $response->assertBadRequest();
})->group('v1.auth');

it('registers a user', function () {
    $data = User::factory()->data();

    $response = postJson(route('v1.auth.register'), [
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'email' => $data['email'],
        'password' => $data['password'],
    ]);

    $response->assertCreated();

    $user = User::findOrFail($response->json('data.id'));

    expect(Hash::check($data['password'], $user->password))->toBeTrue();
})->group('v1.auth');

it('checks a user', function () {
    actingAs(User::factory()->create());

    $response = getJson(route('v1.auth.check'));

    $response->assertOk();
});

it('logs out a user', function () {
    $user = User::factory()->create();

    $token = auth('users')->login($user);

    $response = postJson(
        uri: route('v1.auth.logout'),
        headers: [
            'Authorization' => "Bearer $token",
        ]
    );

    $response->assertNoContent();

    getJson(route('v1.auth.check'))
        ->assertUnauthorized();
});

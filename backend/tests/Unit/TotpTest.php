<?php

use App\Totp;

test('authenticator codes match RFC 6238 SHA1 vectors', function (int $timestamp, string $expected) {
    $totp = new Totp;
    $secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
    expect($totp->code($secret, intdiv($timestamp, 30)))->toBe($expected);
    expect($totp->verify($secret, $expected, $timestamp))->toBe(intdiv($timestamp, 30));
})->with([[59, '287082'], [1111111109, '081804'], [1111111111, '050471'], [1234567890, '005924'], [2000000000, '279037'], [20000000000, '353130']]);

test('authenticator rejects malformed and expired codes', function () {
    $totp = new Totp;
    $secret = $totp->secret();
    expect(strlen($secret))->toBe(32);
    expect($totp->verify($secret, '12345'))->toBeNull();
    expect($totp->verify($secret, $totp->code($secret, 100), 6000))->toBeNull();
});

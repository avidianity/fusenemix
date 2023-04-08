<?php

test('callMethod', function () {
    class TestClass
    {
        public function testMethod()
        {
            return true;
        }
    }

    $instance = new TestClass;

    $value = callMethod($instance, 'testMethod');

    expect($value)->toBeTrue();
})->group('helpers');

test('callMethod with arguments', function () {
    class TestClassWithArguments
    {
        public function testMethod(bool $value)
        {
            return $value;
        }
    }

    $instance = new TestClassWithArguments;

    $value = callMethod(
        object: $instance,
        method: 'testMethod',
        args: [true],
    );

    expect($value)->toBeTrue();
})->group('helpers');

test('callMethod with fallback value', function () {
    class TestClassWithFallbackValue
    {
        //
    }

    $instance = new TestClassWithFallbackValue;

    $value = callMethod($instance, 'testMethod');

    expect($value)->toBeNull();
})->group('helpers');

test('isValidStatusCode 5', function () {
    expect(isValidStatusCode(5))->toBeFalse();
});

test('isValidStatusCode 200', function () {
    expect(isValidStatusCode(200))->toBeTrue();
});

# I'm assuming here that we're only dealing with positive integers, since otherwise the list is infinite
# I'm also assuming we want combinations here, not permutations
primes = []
for num in range(2,9999):
    prime = True
    for multiple in range(2, int(num/2)+1):
        if num % multiple is 0:
            prime = False
    if prime == True:
        primes.append(num)

prime_pairs = []
for prime in primes:
    for other_prime in primes:
        if prime + other_prime == 10000:
            prime_pairs.append([prime, other_prime])
    primes.pop(0)
    primes.pop(primes.index(other_prime))

print(prime_pairs)
print(len(prime_pairs))

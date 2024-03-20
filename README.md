# M4: Distributed Storage

> Full name: `Jackson Davis`
> Email: `jackson_m_davis@brown.edu`
> Username: `jdavis70`

## Summary

> Summarize your implementation, including key challenges you encountered

My implementation comprises `6` new software components, totaling `711` added lines of code over the previous implementation. Key challenges included `ensuring that I was using the correct nodes when calling upon the local store/mem. To fix this I used print statements so I could more easily follow the path of what was happening.`.

## Correctness & Performance Characterization

> Describe how you characterized the correctness and performance of your implementation

_Correctness_: I wrote `5` tests; these tests take `.75 s` to execute.

_Performance_: Storing and retrieving 1000 5-property objects using a 3-node setup results in following average throughput and latency characteristics: `1007`obj/sec and `4` (ms/object) (Note: these objects were pre-generated in memory to avoid accounting for any performance overheads of generating these objects between experiments).

## Key Feature

> Why is the `reconf` method designed to first identify all the keys to be relocated and then relocate individual objects instead of fetching all the objects immediately and then pushing them to their corresponding locations?

The reconf method is designed to first identify all keys to be relocated and then relocate individual objects to ensure efficiency, reliability, and scalability in data handling. This approach allows for precise error handling, minimizes system downtime by enabling granular data migration, and ensures data consistency and integrity by verifying each relocation before proceeding.

## Time to Complete

> Roughly, how many hours did this milestone take you to complete?

Hours: `12 hours`

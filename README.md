# jQuery jqtree extension
A jQuery extension for simple tree management.

## How it works
Simply, invoke it with a data, the simplest way is:
```
var data = [
    {text: "grand parent", id: 1, children: [
        {text: "parent1", id: 2, children: [
            {text: "child1", id: 4},
            {text: "child2", id: 5}
        ]},
        {text: "parent2", id: 3, children: [
            {text: "child3", id: 6},
            {text: "child4", id: 7}
        ]}
    ]}
];
$("#root").jqtree({data: data});
```

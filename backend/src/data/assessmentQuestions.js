// Assessment questions bank: 10 questions per language, 6 topics each
const questions = {
    python: [
        { id: 'py1', topic: 'loops', question: 'What is the output of: for i in range(3): print(i)', options: ['0 1 2', '1 2 3', '0 1 2 3', 'Error'], answer: 0, difficulty: 1 },
        { id: 'py2', topic: 'functions', question: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'fun', 'fn'], answer: 1, difficulty: 1 },
        { id: 'py3', topic: 'arrays', question: 'How do you access the last element of a list `arr`?', options: ['arr[-1]', 'arr[last]', 'arr.last()', 'arr[arr.length-1]'], answer: 0, difficulty: 1 },
        { id: 'py4', topic: 'strings', question: 'What does "hello"[::-1] return?', options: ['hello', 'olleh', 'Error', 'None'], answer: 1, difficulty: 2 },
        { id: 'py5', topic: 'oop', question: 'Which method is the constructor in Python?', options: ['constructor()', '__init__', 'init()', '__new__'], answer: 1, difficulty: 1 },
        { id: 'py6', topic: 'complexity', question: 'What is the time complexity of list.append() in Python?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2, difficulty: 2 },
        { id: 'py7', topic: 'loops', question: 'What does `while True:` do?', options: ['Runs once', 'Infinite loop', 'Syntax error', 'Runs while True is defined'], answer: 1, difficulty: 1 },
        { id: 'py8', topic: 'functions', question: 'What does *args allow in a function?', options: ['Keyword args', 'Variable positional args', 'Default args', 'None'], answer: 1, difficulty: 2 },
        { id: 'py9', topic: 'arrays', question: 'What is the output of [1,2,3] + [4,5]?', options: ['[1,2,3,4,5]', 'Error', '[5,7,3]', 'None'], answer: 0, difficulty: 1 },
        { id: 'py10', topic: 'strings', question: 'How do you check if "ab" is in "abc"?', options: ['"ab" in "abc"', '"abc".has("ab")', '"abc".find("ab") > -1 only', 'Both A and C'], answer: 0, difficulty: 1 },
        { id: 'py11', topic: 'oop', question: 'What is inheritance in OOP?', options: ['Hiding data', 'A class acquiring props of another', 'Overloading', 'None'], answer: 1, difficulty: 2 },
        { id: 'py12', topic: 'complexity', question: 'What is the best-case time complexity of bubble sort?', options: ['O(n²)', 'O(n)', 'O(log n)', 'O(1)'], answer: 1, difficulty: 3 }
    ],
    javascript: [
        { id: 'js1', topic: 'loops', question: 'Which loop ensures execution at least once?', options: ['for', 'while', 'do...while', 'forEach'], answer: 2, difficulty: 1 },
        { id: 'js2', topic: 'functions', question: 'Arrow function syntax for a function returning x+1?', options: ['(x) => x+1', 'x -> x+1', 'fn(x) x+1', '(x): x+1'], answer: 0, difficulty: 1 },
        { id: 'js3', topic: 'arrays', question: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], answer: 0, difficulty: 1 },
        { id: 'js4', topic: 'strings', question: 'How do you convert a string to uppercase?', options: ['.toUpperCase()', '.uppercase()', '.toUpper()', '.upper()'], answer: 0, difficulty: 1 },
        { id: 'js5', topic: 'oop', question: 'What keyword creates a class instance?', options: ['create', 'new', 'this', 'instance'], answer: 1, difficulty: 1 },
        { id: 'js6', topic: 'complexity', question: 'Time complexity of Array.find()?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, difficulty: 2 },
        { id: 'js7', topic: 'loops', question: 'What does Array.map() return?', options: ['Modified original array', 'New array', 'undefined', 'Boolean'], answer: 1, difficulty: 2 },
        { id: 'js8', topic: 'functions', question: 'What is a closure?', options: ['A stopped function', 'Function with access to outer scope vars', 'Anonymous function', 'None'], answer: 1, difficulty: 3 },
        { id: 'js9', topic: 'arrays', question: 'How do you remove the first element of an array?', options: ['pop()', 'remove()', 'shift()', 'splice()'], answer: 2, difficulty: 1 },
        { id: 'js10', topic: 'strings', question: 'How do you split a string "a,b,c" by comma?', options: ['.split(",")', '.divide(",")', '.slice(",")', '.break(",")'], answer: 0, difficulty: 1 },
        { id: 'js11', topic: 'oop', question: 'What does "this" refer to inside a class method?', options: ['Global object', 'The class instance', 'The function', 'undefined'], answer: 1, difficulty: 2 },
        { id: 'js12', topic: 'complexity', question: 'What is the time complexity of Object key lookup?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2, difficulty: 2 }
    ],
    cpp: [
        { id: 'cpp1', topic: 'loops', question: 'Which loop is best for iterating over a known range?', options: ['while', 'do-while', 'for', 'goto'], answer: 2, difficulty: 1 },
        { id: 'cpp2', topic: 'functions', question: 'What is function overloading?', options: ['Same name, same params', 'Same name, different params', 'Virtual functions', 'Template function'], answer: 1, difficulty: 2 },
        { id: 'cpp3', topic: 'arrays', question: 'How do you access element at index 2 of array arr?', options: ['arr{2}', 'arr(2)', 'arr[2]', 'arr->2'], answer: 2, difficulty: 1 },
        { id: 'cpp4', topic: 'strings', question: 'Which header is needed for std::string?', options: ['<string.h>', '<string>', '<str>', '<cstring>'], answer: 1, difficulty: 1 },
        { id: 'cpp5', topic: 'oop', question: 'What is a virtual function?', options: ['Pure function', 'Overridden in derived class at runtime', 'Inline function', 'Static function'], answer: 1, difficulty: 3 },
        { id: 'cpp6', topic: 'complexity', question: 'Space complexity of an n-element array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 1, difficulty: 1 },
        { id: 'cpp7', topic: 'loops', question: 'What does break do in a loop?', options: ['Skip current iteration', 'Exit the loop', 'Pause execution', 'Restart loop'], answer: 1, difficulty: 1 },
        { id: 'cpp8', topic: 'functions', question: 'What is pass-by-reference?', options: ['Passing a copy', 'Passing a pointer', 'Passing original variable', 'Passing value'], answer: 2, difficulty: 2 },
        { id: 'cpp9', topic: 'arrays', question: 'What is the size of int arr[5]?', options: ['5 bytes', '20 bytes', '10 bytes', 'Unknown'], answer: 1, difficulty: 2 },
        { id: 'cpp10', topic: 'strings', question: 'How do you get the length of a std::string s?', options: ['s.length()', 'len(s)', 'strlen(s)', 'size(s)'], answer: 0, difficulty: 1 },
        { id: 'cpp11', topic: 'oop', question: 'What is encapsulation?', options: ['Hiding internal details', 'Inheriting parent', 'Function overloading', 'Memory management'], answer: 0, difficulty: 2 },
        { id: 'cpp12', topic: 'complexity', question: 'Time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], answer: 2, difficulty: 2 }
    ],
    java: [
        { id: 'java1', topic: 'loops', question: 'Which Java loop guarantees at least one execution?', options: ['for', 'while', 'do-while', 'for-each'], answer: 2, difficulty: 1 },
        { id: 'java2', topic: 'functions', question: 'What is the return type of a void method?', options: ['null', 'Nothing (no return)', '0', 'false'], answer: 1, difficulty: 1 },
        { id: 'java3', topic: 'arrays', question: 'How do you declare an int array of size 5?', options: ['int arr[5]', 'int[] arr = new int[5]', 'int arr = new int(5)', 'int[5] arr'], answer: 1, difficulty: 1 },
        { id: 'java4', topic: 'strings', question: 'How do you compare two strings in Java?', options: ['str1 == str2', 'str1.equals(str2)', 'str1.compare(str2)', 'equals(str1, str2)'], answer: 1, difficulty: 2 },
        { id: 'java5', topic: 'oop', question: 'What keyword prevents a class from being extended?', options: ['private', 'sealed', 'final', 'static'], answer: 2, difficulty: 2 },
        { id: 'java6', topic: 'complexity', question: 'Time complexity of HashMap.get()?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2, difficulty: 2 },
        { id: 'java7', topic: 'loops', question: 'What is the enhanced for loop called?', options: ['for-in', 'for-each', 'for-of', 'for-range'], answer: 1, difficulty: 1 },
        { id: 'java8', topic: 'functions', question: 'Which modifier makes a method accessible only within its class?', options: ['public', 'protected', 'private', 'default'], answer: 2, difficulty: 1 },
        { id: 'java9', topic: 'arrays', question: 'How do you get the length of an array arr in Java?', options: ['arr.length()', 'arr.size()', 'arr.length', 'len(arr)'], answer: 2, difficulty: 1 },
        { id: 'java10', topic: 'strings', question: 'Which method converts a String to char array in Java?', options: ['.split("")', '.toCharArray()', '.chars()', '.charArray()'], answer: 1, difficulty: 2 },
        { id: 'java11', topic: 'oop', question: 'What is polymorphism?', options: ['Single class, multiple instances', 'One interface, many implementations', 'Multiple inheritance', 'Static binding'], answer: 1, difficulty: 2 },
        { id: 'java12', topic: 'complexity', question: 'Worst-case time complexity of quicksort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 2, difficulty: 3 }
    ]
};

// Score → skill level mapping
const getSkillLevel = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'advanced';
    if (percentage >= 50) return 'intermediate';
    return 'beginner';
};

module.exports = { questions, getSkillLevel };

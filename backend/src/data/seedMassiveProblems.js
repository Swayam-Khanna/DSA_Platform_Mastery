const mongoose = require('mongoose');
require('dotenv').config();
const Problem = require('../models/Problem');

const topics = ['arrays', 'strings', 'linked-lists', 'stacks', 'queues', 'trees', 'graphs', 'dynamic-programming', 'greedy', 'backtracking', 'hashing', 'sliding-window', 'recursion', 'binary-search', 'sorting'];
const companies = ['Amazon', 'Google', 'Meta', 'Microsoft', 'Netflix', 'Apple', 'Uber', 'LinkedIn', 'Twitter', 'Adobe'];
const difficulties = ['easy', 'medium', 'hard'];

// Base patterns to mutate from
const rootPatterns = [
    { baseTitle: "Two Sum", desc: "Find two numbers that add up to a target.", topic: "arrays", lc: "two-sum", gfg: "key-pair5616/1" },
    { baseTitle: "Maximum Subarray", desc: "Find the contiguous subarray with the largest sum.", topic: "arrays", lc: "maximum-subarray", gfg: "kadanes-algorithm-1587115620/1" },
    { baseTitle: "Valid Parentheses", desc: "Determine if the input string has valid parentheses.", topic: "stacks", lc: "valid-parentheses", gfg: "parenthesis-checker2744/1" },
    { baseTitle: "Reverse Linked List", desc: "Reverse a singly linked list.", topic: "linked-lists", lc: "reverse-linked-list", gfg: "reverse-a-linked-list/1" },
    { baseTitle: "Binary Tree Level Order Traversal", desc: "Return the level order traversal of a binary tree.", topic: "trees", lc: "binary-tree-level-order-traversal", gfg: "level-order-traversal/1" },
    { baseTitle: "Merge Intervals", desc: "Merge all overlapping intervals.", topic: "arrays", lc: "merge-intervals", gfg: "overlapping-intervals--170633/1" },
    { baseTitle: "Number of Islands", desc: "Count the number of islands in a grid.", topic: "graphs", lc: "number-of-islands", gfg: "find-the-number-of-islands/1" },
    { baseTitle: "Climbing Stairs", desc: "Find distinct ways to climb n stairs.", topic: "dynamic-programming", lc: "climbing-stairs", gfg: "count-ways-to-reach-the-nth-stair-1587115620/1" },
    { baseTitle: "Longest Substring Without Repeating", desc: "Find length of longest substring.", topic: "strings", lc: "longest-substring-without-repeating-characters", gfg: "longest-distinct-characters-in-string5848/1" },
    { baseTitle: "Course Schedule", desc: "Determine if you can finish all courses.", topic: "graphs", lc: "course-schedule", gfg: "prerequisite-tasks/1" },
    { baseTitle: "LRU Cache", desc: "Design and implement an LRU cache.", topic: "linked-lists", lc: "lru-cache", gfg: "lru-cache/1" },
    { baseTitle: "Lowest Common Ancestor", desc: "Find the lowest common ancestor in a BST.", topic: "trees", lc: "lowest-common-ancestor-of-a-binary-tree", gfg: "lowest-common-ancestor-in-a-binary-tree/1" },
    { baseTitle: "Word Search", desc: "Check if word exists in a 2D board.", topic: "backtracking", lc: "word-search", gfg: "word-search/1" },
    { baseTitle: "Top K Frequent Elements", desc: "Find the k most frequent elements in an array.", topic: "hashing", lc: "top-k-frequent-elements", gfg: "top-k-frequent-elements-in-array/1" },
    { baseTitle: "Find Peak Element", desc: "Find a peak element in an array.", topic: "binary-search", lc: "find-peak-element", gfg: "peak-element/1" },
    { baseTitle: "Merge K Sorted Lists", desc: "Merge k sorted linked lists and return it as one sorted list.", topic: "linked-lists", lc: "merge-k-sorted-lists", gfg: "merge-k-sorted-linked-lists/1" },
    { baseTitle: "Trapping Rain Water", desc: "Compute how much water it is able to trap after raining.", topic: "arrays", lc: "trapping-rain-water", gfg: "trapping-rain-water-1587115621/1" },
    { baseTitle: "Median of Two Sorted Arrays", desc: "Find the median of the two sorted arrays.", topic: "binary-search", lc: "median-of-two-sorted-arrays", gfg: "median-of-two-sorted-arrays1618/1" },
    { baseTitle: "Word Break", desc: "Determine if s can be segmented into space-separated dictionary words.", topic: "dynamic-programming", lc: "word-break", gfg: "word-break1352/1" },
    { baseTitle: "Container With Most Water", desc: "Find two lines that together with the x-axis forms a container.", topic: "arrays", lc: "container-with-most-water", gfg: "container-with-most-water4106/1" },
    { baseTitle: "Product of Array Except Self", desc: "Return an array such that answer[i] is equal to product of all elements except self.", topic: "arrays", lc: "product-of-array-except-self", gfg: "product-array-puzzle4524/1" },
    { baseTitle: "Valid Anagram", desc: "Determine if t is an anagram of s.", topic: "strings", lc: "valid-anagram", gfg: "check-whether-any-anagram-of-a-string-is-palindrome-or-not1346/1" },
    { baseTitle: "House Robber", desc: "Find the maximum amount of money you can rob tonight without alerting police.", topic: "dynamic-programming", lc: "house-robber", gfg: "house-robber-problem-1587115620/1" },
    { baseTitle: "Pacific Atlantic Water Flow", desc: "Find coordinates where water can flow to both Pacific and Atlantic.", topic: "graphs", lc: "pacific-atlantic-water-flow", gfg: "pacific-atlantic-water-flow/1" },
    { baseTitle: "Longest Consecutive Sequence", desc: "Find the length of the longest consecutive elements sequence.", topic: "hashing", lc: "longest-consecutive-sequence", gfg: "longest-consecutive-subsequence2449/1" },
    { baseTitle: "Search in Rotated Sorted Array", desc: "Search for target in a rotated sorted array.", topic: "binary-search", lc: "search-in-rotated-sorted-array", gfg: "search-in-a-rotated-array0959/1" },
    { baseTitle: "Non-overlapping Intervals", desc: "Find the minimum number of intervals to remove to make the rest non-overlapping.", topic: "greedy", lc: "non-overlapping-intervals", gfg: "non-overlapping-intervals/1" },
    { baseTitle: "Meeting Rooms II", desc: "Find the minimum number of conference rooms required.", topic: "greedy", lc: "meeting-rooms-ii", gfg: "meeting-rooms-ii/1" },
    { baseTitle: "Encode and Decode Strings", desc: "Design an algorithm to encode and decode a list of strings.", topic: "strings", lc: "encode-and-decode-strings", gfg: "encode-and-decode-strings/1" },
    { baseTitle: "Subtree of Another Tree", desc: "Check if tree t is a subtree of tree s.", topic: "trees", lc: "subtree-of-another-tree", gfg: "check-if-subtree/1" },
    { baseTitle: "Spiral Matrix", desc: "Return all elements of the matrix in spiral order.", topic: "arrays", lc: "spiral-matrix", gfg: "spirally-traversing-a-matrix-1587115621/1" },
    { baseTitle: "Longest Increasing Subsequence", desc: "Find the length of the longest strictly increasing subsequence.", topic: "dynamic-programming", lc: "longest-increasing-subsequence", gfg: "longest-increasing-subsequence-1587115620/1" },
    { baseTitle: "Jump Game", desc: "Determine if you are able to reach the last index.", topic: "greedy", lc: "jump-game", gfg: "jump-game/1" },
    { baseTitle: "Clone Graph", desc: "Return a deep copy of the graph.", topic: "graphs", lc: "clone-graph", gfg: "clone-graph/1" },
    { baseTitle: "Rotate Image", desc: "Rotate the image by 90 degrees clockwise.", topic: "arrays", lc: "rotate-image", gfg: "rotate-by-90-degree-1587115621/1" },
    { baseTitle: "Kth Smallest Element in a BST", desc: "Find the kth smallest element in the BST.", topic: "trees", lc: "kth-smallest-element-in-a-bst", gfg: "find-k-th-smallest-element-in-bst/1" },
    { baseTitle: "Serialize and Deserialize Binary Tree", desc: "Design an algorithm to serialize and deserialize a binary tree.", topic: "trees", lc: "serialize-and-deserialize-binary-tree", gfg: "serialize-and-deserialize-a-binary-tree/1" },
    { baseTitle: "Design Add and Search Words Data Structure", desc: "Design data structure that supports adding words and searching with dots.", topic: "backtracking", lc: "design-add-and-search-words-data-structure", gfg: "design-a-trie-data-structure/1" },
    { baseTitle: "Word Search II", desc: "Find all words in the board that are in the dictionary.", topic: "backtracking", lc: "word-search-ii", gfg: "word-search-ii/1" },
    { baseTitle: "Find All Anagrams in a String", desc: "Find all the start indices of p's anagrams in s.", topic: "sliding-window", lc: "find-all-anagrams-in-a-string", gfg: "count-occurences-of-anagrams6222/1" },
    { baseTitle: "Longest Repeating Character Replacement", desc: "Find length of longest substring containing the same letter after k replacements.", topic: "sliding-window", lc: "longest-repeating-character-replacement", gfg: "longest-repeating-character-replacement/1" },
    { baseTitle: "Minimum Window Substring", desc: "Find the minimum window in s which will contain all characters in t.", topic: "sliding-window", lc: "minimum-window-substring", gfg: "smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621/1" },
    { baseTitle: "Daily Temperatures", desc: "Find how many days you have to wait for a warmer temperature.", topic: "stacks", lc: "daily-temperatures", gfg: "daily-temperatures/1" },
    { baseTitle: "Queue Reconstruction by Height", desc: "Reconstruct the queue based on pairs of (h, k).", topic: "greedy", lc: "queue-reconstruction-by-height", gfg: "queue-reconstruction-by-height/1" },
    { baseTitle: "Gas Station", desc: "Find the starting gas station index to complete the circuit.", topic: "greedy", lc: "gas-station", gfg: "gas-station/1" },
    { baseTitle: "Coin Change", desc: "Find the fewest number of coins needed to make up an amount.", topic: "dynamic-programming", lc: "coin-change", gfg: "number-of-coins1824/1" },
    { baseTitle: "Decode Ways", desc: "Determine total number of ways to decode a string.", topic: "dynamic-programming", lc: "decode-ways", gfg: "decode-ways/1" },
    { baseTitle: "Combination Sum", desc: "Find all unique combinations in candidates where numbers sum to target.", topic: "backtracking", lc: "combination-sum", gfg: "combination-sum-1587115620/1" },
    { baseTitle: "Subsets", desc: "Return all possible subsets (the power set).", topic: "backtracking", lc: "subsets", gfg: "subsets1613/1" },
    { baseTitle: "Permutations", desc: "Return all possible permutations of an array.", topic: "backtracking", lc: "permutations", gfg: "permutations-of-a-given-string2041/1" }
];

const generatedProblems = [];

for (let i = 0; i < 500; i++) {
    const rootIndex = i % rootPatterns.length;
    const root = rootPatterns[rootIndex];
    const difficulty = difficulties[i % 3];
    const topic = i % 2 === 0 ? topics[i % topics.length] : root.topic; 
    const company = companies[i % companies.length];
    
    // First rootPatterns.length problems are the "Pure" classics
    const isPureClassic = i < rootPatterns.length;
    
    const titleVariant = isPureClassic ? root.baseTitle : `${root.baseTitle} Variation ${i + 1}`;
    const slug = isPureClassic ? root.lc : `${root.lc}-var-${i + 1}`;
    
    generatedProblems.push({
        title: titleVariant,
        slug: slug,
        description: isPureClassic 
            ? `Solve the classic ${root.baseTitle} problem. ${root.desc} This is a fundamental challenge frequently asked in technical interviews.`
            : `This is variation ${i + 1} of the classic ${root.baseTitle} problem. ${root.desc} Optimize for time and space complexity.`,
        difficulty: difficulty,
        topic: topic,
        companyTags: [company, companies[(i + 1) % companies.length]],
        conceptTags: [topic, 'optimization'],
        starterCode: {
            cpp: `class Solution {\npublic:\n    void solve() {\n        \n    }\n};`,
            java: `class Solution {\n    public void solve() {\n        \n    }\n}`,
            python: `class Solution:\n    def solve(self):\n        pass`,
            javascript: `var solve = function() {\n    \n};`
        },
        testCases: [
            { input: "1 2 3", expectedOutput: "6", isHidden: false },
            { input: "4 5 6", expectedOutput: "15", isHidden: true }
        ],
        examples: [
            { input: "1 2 3", output: "6", explanation: "Basic example case to illustrate logic." }
        ],
        constraints: ["1 <= N <= 10^5", "-10^9 <= A[i] <= 10^9"],
        hints: ["Think about using a hash map.", "Can you do it in O(N) time with O(1) space?"],
        leetcodeLink: `https://leetcode.com/problems/${root.lc}`,
        gfgLink: `https://practice.geeksforgeeks.org/problems/${root.gfg}`,
        orderIndex: i
    });
}

const seedMassiveData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_mastery');
        console.log('MongoDB Connected for Massive Seeding...');

        console.log('Clearing old problems...');
        await Problem.deleteMany({});
        
        console.log('Inserting 500 massive problems...');
        await Problem.insertMany(generatedProblems);
        
        console.log('✅ Successfully seeded 500 problems!');
        process.exit();
    } catch (err) {
        console.error('❌ Error seeding data:', err);
        process.exit(1);
    }
};

seedMassiveData();

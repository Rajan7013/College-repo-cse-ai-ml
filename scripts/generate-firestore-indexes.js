/**
 * Generate all possible Firestore index combinations for advanced filtering
 * This script creates indexes for all possible filter combinations to avoid manual index creation
 */

const fs = require('fs');
const path = require('path');

// Define all possible filter fields in order (IMPORTANT: Order matters for Firestore!)
const FILTER_FIELDS = {
    resources: [
        'regulation',
        'year',
        'semester',
        'branch',
        'subjectCode',
        'unit',
        'documentType',
        'fileType'
    ],
    subjects: [
        'regulation',
        'year',
        'semester'
    ]
};

// Sort field (always last)
const SORT_FIELD = 'uploadedAt';
const SUBJECTS_SORT_FIELD = 'code';

/**
 * Generate all possible combinations of an array
 * @param {Array} arr - Array of items
 * @returns {Array} - All possible combinations
 */
function getAllCombinations(arr) {
    const result = [];

    // Generate all possible combinations (power set)
    const powerSet = (array, prefix = []) => {
        result.push([...prefix]);
        for (let i = 0; i < array.length; i++) {
            powerSet(array.slice(i + 1), [...prefix, array[i]]);
        }
    };

    powerSet(arr);
    return result.filter(combo => combo.length > 0); // Remove empty combination
}

/**
 * Generate index definition for Firestore
 */
function generateIndex(collection, fields, sortField, sortOrder = 'DESCENDING') {
    if (fields.length === 0) return null;

    const indexFields = fields.map(field => ({
        fieldPath: field,
        order: 'ASCENDING'
    }));

    // Add sort field
    indexFields.push({
        fieldPath: sortField,
        order: sortOrder
    });

    return {
        collectionGroup: collection,
        queryScope: 'COLLECTION',
        fields: indexFields
    };
}

/**
 * Main function to generate all indexes
 */
function generateAllIndexes() {
    const indexes = [];

    // 1. Generate indexes for resources collection
    console.log('Generating indexes for resources collection...');
    const resourceCombinations = getAllCombinations(FILTER_FIELDS.resources);

    resourceCombinations.forEach(combo => {
        const index = generateIndex('resources', combo, SORT_FIELD);
        if (index) {
            indexes.push(index);
        }
    });

    // 2. Generate indexes for subjects collection
    console.log('Generating indexes for subjects collection...');
    const subjectCombinations = getAllCombinations(FILTER_FIELDS.subjects);

    subjectCombinations.forEach(combo => {
        const index = generateIndex('subjects', combo, SUBJECTS_SORT_FIELD, 'ASCENDING');
        if (index) {
            indexes.push(index);
        }
    });

    // 3. Add special index for projects
    indexes.push({
        collectionGroup: 'projects',
        queryScope: 'COLLECTION',
        fields: [
            { fieldPath: 'status', order: 'ASCENDING' },
            { fieldPath: 'publishedAt', order: 'DESCENDING' }
        ]
    });

    console.log(`\nGenerated ${indexes.length} total indexes`);
    console.log(`- Resources: ${resourceCombinations.length} combinations`);
    console.log(`- Subjects: ${subjectCombinations.length} combinations`);
    console.log(`- Projects: 1 index`);

    return indexes;
}

/**
 * Write indexes to firestore.indexes.json
 */
function writeIndexesToFile(indexes) {
    const firestoreIndexesPath = path.join(__dirname, '..', 'firestore.indexes.json');

    const indexConfig = {
        indexes: indexes,
        fieldOverrides: []
    };

    fs.writeFileSync(
        firestoreIndexesPath,
        JSON.stringify(indexConfig, null, 2),
        'utf8'
    );

    console.log(`\n✅ Successfully wrote ${indexes.length} indexes to firestore.indexes.json`);
    console.log(`📁 File location: ${firestoreIndexesPath}`);
}

/**
 * Main execution
 */
function main() {
    console.log('🔥 Firebase Index Generator\n');
    console.log('Generating all possible index combinations...\n');

    const indexes = generateAllIndexes();
    writeIndexesToFile(indexes);

    console.log('\n📋 Next steps:');
    console.log('1. Run: firebase deploy --only firestore:indexes');
    console.log('2. Wait 5-10 minutes for all indexes to build');
    console.log('3. All filter combinations will work without errors!\n');
    console.log('⚠️  Note: This will create ' + indexes.length + ' indexes in Firebase.');
    console.log('   Firestore has a limit of 200 composite indexes per database.');
}

// Run the script
main();

import PouchDB from 'pouchdb'
import {
  emptyItemQuery
} from './item'

const localDB = new PouchDB('mmt-ss2017')
const remoteDB = new PouchDB('https://couchdb.5k20.com/mmt-ss2017')

export default class Store {
    /**
     * @param {!string} name Database name
     * @param {function()} [callback] Called when the Store is ready
     */
    constructor(name, callback) {
        
        const localDB = new PouchDB('mmt-ss2017');

        window.db = localDB;

        const remoteDB = new PouchDB('https://couchdb.5k20.com/mmt-ss2017', {
            auth: {
                username: 'lklappert',
                password: 'test'
            }
        });

        localDB.sync(remoteDB, {
            live: true,
            retry: true
        });

        /**
         * @type {ItemList}
         */
        let liveTodos

        /**
         * Read the local ItemList from localStorage.
         *
         * @returns {ItemList} Current array of todos
         */
        this.getStore = () => {
            return localDB.allDocs({
                include_docs: true
            });
        }

        /**
         * Write the local ItemList to localStorage.
         *
         * @param {ItemList} todos Array of todos to write
         */
        /*this.setStore = (todos) => {
            livetodos = todos;
            localDB.put(todos);
        }*/

        if (callback) {
            callback()
        }
    }

    /**
     * Find items with properties matching those on query.
     *
     * @param {ItemQuery} query Query to match
     * @param {function(ItemList)} callback Called when the query is done
     *
     * @example
     * db.find({completed: true}, data => {
	 *	 // data shall contain items whose completed properties are true
	 * })
     */
    find(query, callback) {

        return this.getStore().then((todos) => {
            let k

            const items = todos.rows.filter(todo => {
                for (k in query) {
                    if (query[k] !== todo.doc[k]) {
                        return false
                    }
                }
                return true
            });

            if(callback) {
                callback(items);
            }

            return items;
        })
        
    }

    /**
     * Update an item in the Store.
     *
     * @param {ItemUpdate} update Record with an id and a property to update
     * @param {function()} [callback] Called when partialRecord is applied
     */
    update(update, callback) {
        return localDB.get(update.id.toString()).then((item) => {
            
            Object.keys(update).forEach((key) => {
                item[key] = update[key];
            });

            localDB.put(item).then(() => {
                if (callback) {
                    callback()
                }
            });
        });
    }


    /**
     * Insert an item into the Store.
     *
     * @param {Item} item Item to insert
     * @param {function()} [callback] Called when item is inserted
     */
    insert(item, callback) {
        item._id = item.id.toString();

        return localDB.put(item).then(() => {
            if (callback) {
                callback()
            }
        }); 
    }

    /**
     * Remove items from the Store based on a query.
     *
     * @param {ItemQuery} query Query matching the items to remove
     * @param {function(ItemList)|function()} [callback] Called when records matching query are removed
     */
    remove(query, callback) {

        let items = [];

        return this.find(query).then(todos => {
            items = todos.map(item => {
                item.doc._deleted = true;
                return item.doc;
            });

            localDB.bulkDocs(items).then(() => {
                if(callback) {
                    this.getStore().then(todos => {
                        callback(todos.rows);    
                    })
                }
            });

        });

    }

    /**
     * Count total, active, and completed todos.
     *
     * @param {function(number, number, number)} callback Called when the count is completed
     */
    count(callback) {
        return this.find(emptyItemQuery, (data) => {

            const total = data.length

            let i = total
            let completed = 0

            while (i--) {
                completed += (data[i].doc.completed || false);
            }

            callback(total, total - completed, completed)
        })
    }
}

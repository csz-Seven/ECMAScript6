/**
 *  作者:Seven
 *  时间:2018/7/26 16:23
 *  Email:csz.seven@gmail.com
 *  描述:EMAScript 6 阮一峰（第三版) -Iterator 和 for...of 循环
 */


/**
 * Iterator 的作用有三个：
 * 一是为各种数据结构，提供一个统一的、简便的访问接口；
 * 二是使得数据结构的成员能够按某种次序排列；
 * 三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。
 * */

/**
 * 原生具备 Iterator 接口的数据结构如下。
 * Array
 * Map
 * Set
 * String
 * TypedArray
 * 函数的arguments 对象
 * NodeList 对象
 **/


/**
 *  作者:Seven
 *  时间:2018/7/26 16:38
 *  Email:csz.seven@gmail.com
 *  描述:实例1-模拟next方法的实现
 */
{
    var it = makeIterator(['a', 'b']);
    console.log(it.next())
    console.log(it.next())
    console.log(it.next())

    function makeIterator(array) {
        var nextIndex = 0;
        return {
            next: function () {
                return nextIndex < array.length ?
                    {value: array[nextIndex++], done: false} :
                    {value: undefined, done: false};
            }
        }
    }
}


/**
 *  作者:Seven
 *  时间:2018/7/26 16:57
 *  Email:csz.seven@gmail.com
 *  描述:实例2-无限循环next
 */
{
    var it = idMaker()
    console.log(it.next().value)
    console.log(it.next().value)
    console.log(it.next().value)

    function idMaker() {
        var index = 0;
        return {
            next: function () {
                return {value: '无限Next' + index++, done: false}
            }
        }
    }
}


/**
 *  作者:Seven
 *  时间:2018/7/26 17:29
 *  Email:csz.seven@gmail.com
 *  描述:实例3-Symbol.iterator
 */
{
    const obj = {
        [Symbol.iterator]: function () {
            return {
                next: function () {
                    return {
                        value: 1,
                        done: true
                    }
                }
            }
        }
    }
}


/**
 *  作者:Seven
 *  时间:2018/7/26 17:34
 *  Email:csz.seven@gmail.com
 *  描述:实例4-原生具备的数据结构
 */
{
    let arr = ['a', 'b', 'c'];
    let iter = arr[Symbol.iterator]();

    console.log('实例4', iter.next())
    console.log('实例4', iter.next())
    console.log('实例4', iter.next())
    console.log('实例4', iter.next())
}


/**
 *  作者:Seven
 *  时间:2018/7/26 17:45
 *  Email:csz.seven@gmail.com
 *  描述:实例5-对象手动增加Symbol.iterator属性
 *  类部署 Iterator 接口的写法
 */
{
    class RangeIterator {
        constructor(start, stop) {
            this.value = start;
            this.stop = stop;
        }

        [Symbol.iterator]() {
            return this;
        }

        next() {
            var value = this.value;
            if (value < this.stop) {
                this.value++;
                return {done: false, value: value}
            }
            return {done: true, value: undefined};
        }
    }

    function range(start, stop) {
        return new RangeIterator(start, stop)
    }

    // 此处使用for...of
    console.log('实例5 ', range(0, 3))
    for (var value of range(0, 3)) {
        console.log('实例5 ', value)
    }
}


/**
 *  作者:Seven
 *  时间:2018/7/26 17:59
 *  Email:csz.seven@gmail.com
 *  描述:实例6-原型链上部署Symbol.iterator
 *  通过遍历器实现指针结构
 */
{
    function Obj(value) {
        this.value = value
        this.next = null
    }

    Obj.prototype[Symbol.iterator] = function () {
        var iterator = {next: next};

        var current = this;

        function next() {
            if (current) {
                var value = current.value;
                current = current.next;
                return {done: false, value: value};
            } else {
                return {done: true}
            }
        }

        return iterator
    }

    var one = new Obj(1)
    var two = new Obj(2)
    var three = new Obj(3)

    one.next = two;
    two.next = three;

    for (var i of one) {
        console.log('实例6-原型链上部署Symbol.iterator →', i)
    }
}


/**
 *  作者:Seven
 *  时间:2018/7/27 10:56
 *  Email:csz.seven@gmail.com
 *  描述:实例7-对象加Iterator接口
 */
{
    let obj = {
        data: ['实例7', '7例实'],
        [Symbol.iterator]() {
            const self = this;
            let index = 0;
            return {
                next() {
                    if (index < self.data.length) {
                        return {
                            value: self.data[index++],
                            done: false
                        };
                    } else {
                        return {value: undefined, done: true}
                    }

                }
            }
        }
    }
}


/**
 *  作者:Seven
 *  时间:2018/7/27 11:16
 *  Email:csz.seven@gmail.com
 *  描述:实例8-奇淫技巧 类似数组的对象，部署Iterator的方法
 *  类似数组：存在数值键名和length属性
 */
{
    //写法1
    NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
    //写法2
    NodeList.prototype[Symbol.iterator] = [][Symbol.iterator]

    // [...document.querySelectorAll('div')]
}


/**
 *  作者:Seven
 *  时间:2018/7/27 11:22
 *  Email:csz.seven@gmail.com
 *  描述:实例9-类似数组(存在数值键名和length属性),部署Iterator的方法
 */
{
    let iterable = {
        0: 'a',
        1: 'b',
        2: 'c',
        length: 3,
        [Symbol.iterator]: Array.prototype[Symbol.iterator]
    }
    for (let item of iterable) {
        console.log('实例9-类似数组部署Iterator →', item)
    }

    let iterable2 = {
        a: 'a',
        b: 'b',
        c: 'c',
        length: 3,
        [Symbol.iterator]: Array.prototype[Symbol.iterator]
    }
    for (let item of iterable2) {
        console.log('实例9-普通对象部署Iterator 无效果→', item)
    }
}


/**
 *  作者:Seven
 *  时间:2018/7/27 13:24
 *  Email:csz.seven@gmail.com
 *  描述:实例10-调用Iterator接口的场合
 */
{
    // 1.结构赋值
    {
        let set = new Set().add('a').add('b').add('c');
        let [x, y] = set;
        let [first, ...rest] = set
    }
    // 2.扩展运算符
    {
        var str = 'hello';
        [...str]
    }
    // 3.yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口.
    {
        // let generator = function* () {
        //     yield  1;
        //     yield* [2, 3, 4];
        //     yield 5;
        // }
        //
        // var iterator = generator()
        //
        // iterator.next() // 1
        // iterator.next() // 2
        // iterator.next() // 3
        // iterator.next() // 4
        // iterator.next() // 5
    }
    // 4.其他场合
    {
        // for...of
        // Array.from()
        // Map()、Set()、WeakMap()、WeakSet()
        // Promise.all()
        // Promise.race()
    }
}


/**
 *  作者:Seven
 *  时间:2018/7/27 14:19
 *  Email:csz.seven@gmail.com
 *  描述:实例11-字符串的Iterator接口
 *  字符串是一个类似数组的对象，也原生具有 Iterator 接口。
 */
{
    var someString = '实例11'
    console.log('实例11→', typeof  someString[Symbol.iterator])
    console.log('实例11→', [...someString])

    var iterator = someString[Symbol.iterator]();
    // console.log('实例11→',iterator)
    console.log('实例11→iterator.next()', iterator.next())
    console.log('实例11→iterator.next()', iterator.next())
    console.log('实例11→iterator.next()', iterator.next())
    console.log('实例11→iterator.next()', iterator.next())
}


/**
 *  作者:Seven
 *  时间:2018/7/27 14:36
 *  Email:csz.seven@gmail.com
 *  描述:实例12-覆盖原生的Symbol.iterator
 */
{
    var str = new String('实例12')
    console.log('实例12 原生 Symbol.iterator→',[...str])

    str[Symbol.iterator] = function () {
        return {
            _first: true,
            next: function () {
                if (this._first) {
                    this._first = false;
                    return {
                        value: '实例12',
                        done: false
                    }
                } else {
                    return {
                        done:true
                    }
                }
            }
        }
    }

    console.log('实例12 覆盖 Symbol.iterator→',[...str])
    console.log(str)
}

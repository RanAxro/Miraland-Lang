/**
 * 监听单选按钮组的选中/取消选中事件（仅支持 ID 监听）
 * @param {string} groupName - radio 按钮的 name 属性值
 * @returns {Object} 包含 onSelectedById 和 onUnselectedById 注册方法的对象
 */
function watchRadioGroup(groupName) {
    const radios = document.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
    let previous = document.querySelector(`input[type="radio"][name="${groupName}"]:checked`);

    // 存储回调：id -> callback[]
    const selectedCallbacks = {};
    const unselectedCallbacks = {};

    // 统一监听 change
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (!this.checked) return;

            // 触发上一个的取消选中回调
            if (previous && previous !== this) {
                const prevId = previous.id;
                if (prevId && unselectedCallbacks[prevId]) {
                    unselectedCallbacks[prevId].forEach(cb => cb({
                        element: previous,
                        value: previous.value,
                        id: prevId
                    }));
                }
            }

            // 触发当前的选中回调
            const currId = this.id;
            if (currId && selectedCallbacks[currId]) {
                selectedCallbacks[currId].forEach(cb => cb({
                    element: this,
                    value: this.value,
                    id: currId
                }));
            }

            previous = this;
        });
    });

    return {
        /**
         * 注册选中回调（通过元素 ID）
         * @param {string} id - radio 元素的 id
         * @param {Function} callback - 回调函数(detail: {element, value, id})
         * @returns {Object} 返回自身，支持链式调用
         */
        onSelectedById(id, callback) {
            if (!selectedCallbacks[id]) selectedCallbacks[id] = [];
            selectedCallbacks[id].push(callback);
            return this;
        },

        /**
         * 注册取消选中回调（通过元素 ID）
         * @param {string} id - radio 元素的 id
         * @param {Function} callback - 回调函数(detail: {element, value, id})
         * @returns {Object} 返回自身，支持链式调用
         */
        onUnselectedById(id, callback) {
            if (!unselectedCallbacks[id]) unselectedCallbacks[id] = [];
            unselectedCallbacks[id].push(callback);
            return this;
        },

        /** 获取当前选中的元素 */
        getCurrent() {
            return previous;
        },

        /** 手动切换到指定 id 的 radio */
        selectById(id) {
            const target = document.getElementById(id);
            if (target && target.type === 'radio' && target.name === groupName) {
                target.click();
            }
        }
    };
}
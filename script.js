class InventoryApp {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderItems();
        
        if (this.items.length === 0) {
            this.loadSampleData();
        }
    }

    bindEvents() {
        const addBtn = document.getElementById('addItemBtn');
        const modal = document.getElementById('itemModal');
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('itemForm');
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');

        addBtn.addEventListener('click', () => this.openModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        searchInput.addEventListener('input', () => this.filterItems());
        categoryFilter.addEventListener('change', () => this.filterItems());
        statusFilter.addEventListener('change', () => this.filterItems());

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    loadSampleData() {
        const sampleItems = [
            {
                id: Date.now() + 1,
                name: 'ノートパソコン Dell XPS 13',
                category: 'IT機器',
                status: '利用可能',
                location: '事務所 2F 機器室',
                description: '軽量で高性能なノートPC。プレゼンテーション用として最適。',
                quantity: 3,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                name: 'オフィスチェア エルゴノミクス',
                category: '家具',
                status: '使用中',
                location: '事務所 1F フロア',
                description: '腰痛軽減設計の高機能オフィスチェア。調整機能が豊富。',
                quantity: 12,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 3,
                name: 'プリンター HP LaserJet',
                category: 'IT機器',
                status: 'メンテナンス',
                location: '事務所 1F コピー室',
                description: '高速レーザープリンター。両面印刷対応。',
                quantity: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 4,
                name: 'ホワイトボード 180×90cm',
                category: 'オフィス用品',
                status: '利用可能',
                location: '会議室A',
                description: 'キャスター付き移動式ホワイトボード。両面使用可能。',
                quantity: 2,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 5,
                name: 'Wi-Fiルーター',
                category: 'IT機器',
                status: '故障',
                location: '事務所 サーバー室',
                description: '高速無線LANルーター。修理待ち状態。',
                quantity: 1,
                createdAt: new Date().toISOString()
            }
        ];

        this.items = sampleItems;
        this.saveToStorage();
        this.renderItems();
    }

    openModal(item = null) {
        const modal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('itemForm');

        if (item) {
            modalTitle.textContent = '備品編集';
            this.currentEditId = item.id;
            this.fillForm(item);
        } else {
            modalTitle.textContent = '備品追加';
            this.currentEditId = null;
            form.reset();
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('itemModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentEditId = null;
    }

    fillForm(item) {
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemStatus').value = item.status;
        document.getElementById('itemLocation').value = item.location;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemQuantity').value = item.quantity;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('itemName').value.trim(),
            category: document.getElementById('itemCategory').value,
            status: document.getElementById('itemStatus').value,
            location: document.getElementById('itemLocation').value.trim(),
            description: document.getElementById('itemDescription').value.trim(),
            quantity: parseInt(document.getElementById('itemQuantity').value)
        };

        if (!formData.name || !formData.category || !formData.location) {
            alert('必須項目を入力してください。');
            return;
        }

        if (this.currentEditId) {
            this.updateItem(this.currentEditId, formData);
        } else {
            this.addItem(formData);
        }

        this.closeModal();
    }

    addItem(itemData) {
        const newItem = {
            id: Date.now(),
            ...itemData,
            createdAt: new Date().toISOString()
        };

        this.items.unshift(newItem);
        this.saveToStorage();
        this.renderItems();
        this.showNotification('備品が追加されました。', 'success');
    }

    updateItem(id, itemData) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index] = {
                ...this.items[index],
                ...itemData,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            this.renderItems();
            this.showNotification('備品が更新されました。', 'success');
        }
    }

    deleteItem(id) {
        if (confirm('この備品を削除してもよろしいですか？')) {
            this.items = this.items.filter(item => item.id !== id);
            this.saveToStorage();
            this.renderItems();
            this.showNotification('備品が削除されました。', 'success');
        }
    }

    filterItems() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const filteredItems = this.items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                                item.description.toLowerCase().includes(searchTerm) ||
                                item.location.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || item.category === categoryFilter;
            const matchesStatus = !statusFilter || item.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        this.renderItems(filteredItems);
    }

    renderItems(itemsToRender = null) {
        const grid = document.getElementById('itemsGrid');
        const items = itemsToRender || this.items;

        if (items.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-box-open"></i>
                    <h3>備品がありません</h3>
                    <p>新しい備品を追加して管理を始めましょう。</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = items.map(item => this.createItemCard(item)).join('');
    }

    createItemCard(item) {
        const statusClass = this.getStatusClass(item.status);
        const createdDate = new Date(item.createdAt).toLocaleDateString('ja-JP');

        return `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-name">${this.escapeHtml(item.name)}</div>
                        <span class="item-category">${this.escapeHtml(item.category)}</span>
                    </div>
                </div>
                <div class="item-details">
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-info-circle"></i> ステータス
                        </span>
                        <span class="status-badge ${statusClass}">${this.escapeHtml(item.status)}</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-map-marker-alt"></i> 保管場所
                        </span>
                        <span class="item-detail-value">${this.escapeHtml(item.location)}</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-list-ol"></i> 数量
                        </span>
                        <span class="item-detail-value">${item.quantity}個</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-calendar"></i> 登録日
                        </span>
                        <span class="item-detail-value">${createdDate}</span>
                    </div>
                    ${item.description ? `
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-comment"></i> 説明
                        </span>
                        <span class="item-detail-value">${this.escapeHtml(item.description)}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn btn-edit btn-small" onclick="app.openModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i> 編集
                    </button>
                    <button class="btn btn-danger btn-small" onclick="app.deleteItem(${item.id})">
                        <i class="fas fa-trash"></i> 削除
                    </button>
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        const statusMap = {
            '利用可能': 'status-available',
            '使用中': 'status-in-use',
            'メンテナンス': 'status-maintenance',
            '故障': 'status-broken'
        };
        return statusMap[status] || '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        localStorage.setItem('inventoryItems', JSON.stringify(this.items));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : '#0c5460'};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#bee5eb'};
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new InventoryApp();
});
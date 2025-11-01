document.addEventListener('DOMContentLoaded', () => {

    // Validasi input form
    const validateInput = (input) => {
        if (!input) return false;
        const parent = input.parentElement;
        if (input.value.trim() === '') {
            if (parent) parent.classList.add('error');
            return false;
        } else {
            if (parent) parent.classList.remove('error');
            return true;
        }
    };

    // Menampilkan dialog konfirmasi custom (untuk delete confirmation)
    const showConfirmDialog = (title, message) => {
        return new Promise((resolve) => {
            const dialog = document.getElementById('confirmDialog');
            const titleEl = document.getElementById('confirmTitle');
            const messageEl = document.getElementById('confirmMessage');
            const okBtn = document.getElementById('confirmOk');
            const cancelBtn = document.getElementById('confirmCancel');
            const closeBtn = document.getElementById('closeConfirmDialog');

            if (!dialog) {
                resolve(window.confirm(message));
                return;
            }

            titleEl.textContent = title;
            messageEl.textContent = message;
            dialog.classList.add('visible');

            const handleOk = () => {
                dialog.classList.remove('visible');
                cleanup();
                resolve(true);
            };

            const handleCancel = () => {
                dialog.classList.remove('visible');
                cleanup();
                resolve(false);
            };

            const cleanup = () => {
                okBtn.removeEventListener('click', handleOk);
                cancelBtn.removeEventListener('click', handleCancel);
                closeBtn.removeEventListener('click', handleCancel);
                dialog.removeEventListener('click', handleOutsideClick);
            };

            const handleOutsideClick = (e) => {
                if (e.target === dialog) {
                    handleCancel();
                }
            };

            okBtn.addEventListener('click', handleOk);
            cancelBtn.addEventListener('click', handleCancel);
            closeBtn.addEventListener('click', handleCancel);
            dialog.addEventListener('click', handleOutsideClick);
        });
    };

    // Menampilkan notifikasi sukses (toast notification)
    const showNotification = (message) => {
        const notification = document.getElementById('successNotification');
        const messageEl = document.getElementById('notificationMessage');

        if (!notification) {
            alert(message);
            return;
        }

        messageEl.textContent = message;
        notification.classList.add('show');

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    };

    // Menampilkan alert dialog custom
    const showAlertDialog = (title, message) => {
        const alertDialog = document.getElementById('alertDialog');
        const alertTitle = document.getElementById('alertTitle');
        const alertMessage = document.getElementById('alertMessage');
        const alertOkButton = document.getElementById('alertOkButton');

        if (!alertDialog) return;

        alertTitle.textContent = title;
        alertMessage.textContent = message;
        alertDialog.classList.add('visible');

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        const closeAlert = () => {
            alertDialog.classList.remove('visible');
            alertOkButton.removeEventListener('click', closeAlert);
            alertDialog.removeEventListener('click', handleOutsideClick);
        };

        const handleOutsideClick = (e) => {
            if (e.target === alertDialog) {
                closeAlert();
            }
        };

        alertOkButton.addEventListener('click', closeAlert);
        alertDialog.addEventListener('click', handleOutsideClick);
    };

    // Handler untuk halaman login
    function handleLoginPage() {
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const registerLink = document.getElementById('registerLink');
        const forgotModal = document.getElementById('forgotPasswordModal');
        const registerModal = document.getElementById('registerModal');

        // Handle Login Form Submit
        if (loginForm && emailInput && passwordInput) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const isEmailValid = validateInput(emailInput);
                const isPasswordValid = validateInput(passwordInput);

                if (isEmailValid && isPasswordValid) {
                    const user = dataPengguna.find(u => 
                        u.email === emailInput.value && u.password === passwordInput.value
                    );
                    
                    if (user) {
                        sessionStorage.setItem('loggedInUser', user.nama);
                        sessionStorage.setItem('loggedInUserEmail', user.email);
                        sessionStorage.setItem('loggedInUserRole', user.role);
                        window.location.href = 'dashboard.html';
                    } else {
                        showAlertDialog('Login Gagal', 'Email atau password yang Anda masukkan salah.');
                    }
                }
            });
        }

        // Handle Forgot Password Modal
        if (forgotPasswordLink && forgotModal) {
            const closeForgotModal = document.getElementById('closeForgotModal');
            const closeForgotBtn = document.getElementById('closeForgotBtn');
            
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                forgotModal.classList.add('visible');
            });

            const closeForgotModalFn = () => {
                forgotModal.classList.remove('visible');
            };

            if (closeForgotModal) {
                closeForgotModal.addEventListener('click', closeForgotModalFn);
            }

            if (closeForgotBtn) {
                closeForgotBtn.addEventListener('click', closeForgotModalFn);
            }
            
            forgotModal.addEventListener('click', (e) => {
                if (e.target === forgotModal) {
                    closeForgotModalFn();
                }
            });
        }

        // Handle Register Modal
        if (registerLink && registerModal) {
            const closeRegisterModal = document.getElementById('closeRegisterModal');
            const closeRegisterBtn = document.getElementById('closeRegisterBtn');
            
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                registerModal.classList.add('visible');
            });

            const closeRegisterModalFn = () => {
                registerModal.classList.remove('visible');
            };

            if (closeRegisterModal) {
                closeRegisterModal.addEventListener('click', closeRegisterModalFn);
            }

            if (closeRegisterBtn) {
                closeRegisterBtn.addEventListener('click', closeRegisterModalFn);
            }
            
            registerModal.addEventListener('click', (e) => {
                if (e.target === registerModal) {
                    closeRegisterModalFn();
                }
            });
        }
    }

    // Handler untuk sidebar toggle dan logout di semua halaman authenticated
    function handleAuthenticatedPages() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const logoutButton = document.getElementById('logoutButton');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Toggle minimize sidebar
        if (sidebarToggle && sidebar) {
            const toggleIcon = sidebarToggle.querySelector('i');
            
            const updateToggleIcon = () => {
                if (sidebar.classList.contains('minimized')) {
                    toggleIcon.setAttribute('data-lucide', 'chevrons-right');
                } else {
                    toggleIcon.setAttribute('data-lucide', 'chevrons-left');
                }
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            };
            
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('minimized');
                updateToggleIcon();
                
                // Simpan state ke localStorage
                if (sidebar.classList.contains('minimized')) {
                    localStorage.setItem('sidebarMinimized', 'true');
                } else {
                    localStorage.setItem('sidebarMinimized', 'false');
                }
            });

            // Restore state dari localStorage
            if (localStorage.getItem('sidebarMinimized') === 'true') {
                sidebar.classList.add('minimized');
                updateToggleIcon();
            }
        }

        // Toggle submenu
        const submenuToggles = document.querySelectorAll('.submenu-toggle');
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = toggle.parentElement;
                parent.classList.toggle('open');
                
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
        
        if(logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.clear();
                window.location.href = 'index.html';
            });
        }
    }

    // Handler untuk halaman dashboard
    function handleDashboardPage() {
        const greetingEl = document.getElementById('greeting');
        
        if (greetingEl) {
            const user = sessionStorage.getItem('loggedInUser') || 'Pengguna';
            const hours = new Date().getHours();
            let timeOfDay;

            if (hours >= 4 && hours < 11) {
                timeOfDay = 'Pagi';
            } else if (hours >= 11 && hours < 15) {
                timeOfDay = 'Siang';
            } else if (hours >= 15 && hours < 19) {
                timeOfDay = 'Sore';
            } else {
                timeOfDay = 'Malam';
            }
            greetingEl.textContent = `Selamat ${timeOfDay}, ${user}!`;
        }

        const totalStokEl = document.getElementById('totalStok');
        const totalUnitEl = document.getElementById('totalUnit');
        const totalPengirimanEl = document.getElementById('totalPengiriman');

        if (totalStokEl && typeof dataBahanAjar !== 'undefined') {
            totalStokEl.textContent = dataBahanAjar.length;
        }

        if (totalUnitEl && typeof dataBahanAjar !== 'undefined') {
            const totalUnits = dataBahanAjar.reduce((sum, item) => sum + parseInt(item.stok || 0), 0);
            totalUnitEl.textContent = totalUnits.toLocaleString('id-ID');
        }

        if (totalPengirimanEl && typeof dataTracking !== 'undefined') {
            totalPengirimanEl.textContent = Object.keys(dataTracking).length;
        }
    }

    // Handler untuk halaman tracking pengiriman
    function handleTrackingPage() {
        const trackingForm = document.getElementById('trackingForm');
        const nomorResiInput = document.getElementById('nomorResi');
        const resultContainer = document.getElementById('trackingResult');

        if (trackingForm && nomorResiInput && resultContainer) {
            trackingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const resi = nomorResiInput.value.trim();
                
                if (typeof dataTracking === 'undefined') {
                    resultContainer.innerHTML = `<p class="text-danger">Error: Data pelacakan tidak dapat dimuat.</p>`;
                    resultContainer.style.display = 'block';
                    return;
                }
                
                const trackingData = dataTracking[resi];

                resultContainer.innerHTML = '';
                resultContainer.style.display = 'none';

                if (trackingData) {
                    let statusClass = trackingData.status === 'Dalam Perjalanan' ? 'in-progress' : '';

                    let timelineHTML = `
                        <div class="tracking-header">
                            <h3>Informasi Pengiriman</h3>
                            <div class="tracking-info">
                                <div class="tracking-info-item">
                                    <label>Nomor DO</label>
                                    <span>${resi}</span>
                                </div>
                                <div class="tracking-info-item">
                                    <label>Nama Penerima</label>
                                    <span>${trackingData.nama}</span>
                                </div>
                                <div class="tracking-info-item">
                                    <label>Ekspedisi</label>
                                    <span>${trackingData.ekspedisi}</span>
                                </div>
                                <div class="tracking-info-item">
                                    <label>Tanggal Kirim</label>
                                    <span>${trackingData.tanggalKirim}</span>
                                </div>
                                <div class="tracking-info-item">
                                    <label>Paket</label>
                                    <span>${trackingData.paket}</span>
                                </div>
                                <div class="tracking-info-item">
                                    <label>Total</label>
                                    <span>${trackingData.total}</span>
                                </div>
                            </div>
                        </div>
                        <h3 style="margin-top: 24px; margin-bottom: 16px; font-size: 18px; font-weight: 700;">Riwayat Perjalanan</h3>
                        <ul class="tracking-timeline">
                    `;
                    
                    // Reverse to show latest first
                    [...trackingData.perjalanan].reverse().forEach(item => {
                        timelineHTML += `
                            <li>
                                <p>${item.keterangan}</p>
                                <span class="timestamp">${item.waktu}</span>
                            </li>
                        `;
                    });
                    timelineHTML += '</ul>';
                    resultContainer.innerHTML = timelineHTML;
                    resultContainer.style.display = 'block';
                } else {
                    resultContainer.innerHTML = `
                        <p class="text-center">Nomor DO <strong>${resi}</strong> tidak ditemukan.</p>
                        <p class="text-center text-muted">Pastikan nomor yang Anda masukkan benar.</p>
                    `;
                    resultContainer.style.display = 'block';
                }
            });
        }
    }

    // Handler untuk halaman manajemen stok bahan ajar (CRUD)
    function handleStokPage() {
        const stokContainer = document.getElementById('stokContainer');
        const addStockForm = document.getElementById('addStockForm');
        const editStockForm = document.getElementById('editStockForm');
        const editModal = document.getElementById('editStockModal');
        const closeEditModal = document.getElementById('closeEditModal');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const coverModal = document.getElementById('coverModal');
        const closeCoverModal = document.getElementById('closeCoverModal');
        const coverUpload = document.getElementById('coverUpload');
        const filePreview = document.getElementById('filePreview');
        const previewImage = document.getElementById('previewImage');
        const removePreview = document.getElementById('removePreview');
        
        let uploadedImageData = null;
        
        if (typeof dataBahanAjar === 'undefined' || !stokContainer) {
            console.error("Data stok atau kontainer tabel tidak ditemukan.");
            return;
        }

        // Preview gambar cover saat file dipilih
        if (coverUpload) {
            coverUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        uploadedImageData = event.target.result;
                        previewImage.src = event.target.result;
                        filePreview.style.display = 'inline-block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (removePreview) {
            removePreview.addEventListener('click', () => {
                coverUpload.value = '';
                uploadedImageData = null;
                filePreview.style.display = 'none';
                previewImage.src = '';
            });
        }

        const createStokRow = (item, index) => {
            const tr = document.createElement('tr');
            
            let badgeClass = 'high';
            if (item.stok < 100) badgeClass = 'low';
            else if (item.stok < 200) badgeClass = 'medium';
            
            tr.innerHTML = `
                <td>
                    <button class="btn-icon btn-cover" data-index="${index}" title="Lihat Sampul">
                        <i data-lucide="image"></i>
                    </button>
                </td>
                <td>${item.kodeLokasi}</td>
                <td><strong>${item.kodeBarang}</strong></td>
                <td>${item.namaBarang}</td>
                <td>${item.jenisBarang}</td>
                <td>${item.edisi}</td>
                <td><span class="stok-badge ${badgeClass}">${item.stok}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" data-index="${index}" title="Edit">
                            <i data-lucide="pencil"></i>
                        </button>
                        <button class="btn-icon btn-delete" data-index="${index}" title="Hapus">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            `;
            return tr;
        };
        
        const renderStokTable = () => {
            stokContainer.innerHTML = '';
            dataBahanAjar.forEach((item, index) => {
                stokContainer.appendChild(createStokRow(item, index));
            });
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            document.querySelectorAll('.btn-cover').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.currentTarget.getAttribute('data-index');
                    openCoverModal(index);
                });
            });
            
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.currentTarget.getAttribute('data-index');
                    openEditModal(index);
                });
            });
            
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.currentTarget.getAttribute('data-index');
                    deleteStok(index);
                });
            });
        };

        const openCoverModal = (index) => {
            const item = dataBahanAjar[index];
            const coverImage = document.getElementById('coverImage');
            
            document.getElementById('coverTitle').textContent = item.namaBarang;
            document.getElementById('coverInfo').textContent = `${item.kodeBarang} - Edisi ${item.edisi}`;
            
            coverImage.src = item.cover || 'assets/img/default.svg';
            coverImage.onerror = function() {
                this.src = 'assets/img/default.svg';
            };
            
            coverModal.classList.add('visible');
        };

        const openEditModal = (index) => {
            const item = dataBahanAjar[index];
            document.getElementById('editIndex').value = index;
            document.getElementById('editKodeLokasi').value = item.kodeLokasi;
            document.getElementById('editKodeBarang').value = item.kodeBarang;
            document.getElementById('editNamaBarang').value = item.namaBarang;
            document.getElementById('editJenisBarang').value = item.jenisBarang;
            document.getElementById('editEdisi').value = item.edisi;
            document.getElementById('editStok').value = item.stok;
            editModal.classList.add('visible');
        };

        const closeEditModalFn = () => {
            editModal.classList.remove('visible');
            editStockForm.reset();
        };

        const closeCoverModalFn = () => {
            coverModal.classList.remove('visible');
        };

        const deleteStok = async (index) => {
            const item = dataBahanAjar[index];
            const confirmed = await showConfirmDialog(
                'Hapus Stok Bahan Ajar',
                `Apakah Anda yakin ingin menghapus "${item.namaBarang}"? Tindakan ini tidak dapat dibatalkan.`
            );
            
            if (confirmed) {
                dataBahanAjar.splice(index, 1);
                renderStokTable();
                showNotification('Stok berhasil dihapus!');
            }
        };

        if (closeEditModal) {
            closeEditModal.addEventListener('click', closeEditModalFn);
        }

        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', closeEditModalFn);
        }

        if (closeCoverModal) {
            closeCoverModal.addEventListener('click', closeCoverModalFn);
        }

        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    closeEditModalFn();
                }
            });
        }

        if (coverModal) {
            coverModal.addEventListener('click', (e) => {
                if (e.target === coverModal) {
                    closeCoverModalFn();
                }
            });
        }

        if (editStockForm) {
            editStockForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const index = document.getElementById('editIndex').value;
                const inputs = editStockForm.querySelectorAll('input[required], select[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                });

                if (isValid) {
                    dataBahanAjar[index] = {
                        kodeLokasi: document.getElementById('editKodeLokasi').value,
                        kodeBarang: document.getElementById('editKodeBarang').value,
                        namaBarang: document.getElementById('editNamaBarang').value,
                        jenisBarang: document.getElementById('editJenisBarang').value,
                        edisi: document.getElementById('editEdisi').value,
                        stok: parseInt(document.getElementById('editStok').value),
                        cover: dataBahanAjar[index].cover || 'assets/img/default.jpg'
                    };
                    
                    renderStokTable();
                    closeEditModalFn();
                    showNotification('Stok berhasil diupdate!');
                }
            });
        }

        if (addStockForm) {
            addStockForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const inputs = addStockForm.querySelectorAll('input[required], select[required]');
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                });

                if (isValid) {
                    const newStok = {
                        kodeLokasi: document.getElementById('kodeLokasi').value,
                        kodeBarang: document.getElementById('kodeBarang').value,
                        namaBarang: document.getElementById('namaBarang').value,
                        jenisBarang: document.getElementById('jenisBarang').value,
                        edisi: document.getElementById('edisi').value,
                        stok: parseInt(document.getElementById('stok').value),
                        cover: uploadedImageData || 'assets/img/default.svg'
                    };
                    
                    dataBahanAjar.unshift(newStok); 
                    renderStokTable();
                    
                    addStockForm.reset();
                    inputs.forEach(input => input.parentElement.classList.remove('error'));
                    
                    uploadedImageData = null;
                    filePreview.style.display = 'none';
                    previewImage.src = '';
                    
                    showNotification('Stok berhasil ditambahkan!');
                }
            });
        }

        renderStokTable();
    }
    
    // Router: Menjalankan handler yang sesuai berdasarkan halaman yang dibuka
    if (document.getElementById('loginForm')) {
        handleLoginPage();
    } else if (document.getElementById('dashboard-page')) {
        handleAuthenticatedPages();
        handleDashboardPage();
    } else if (document.getElementById('tracking-page')) {
        handleAuthenticatedPages();
        handleTrackingPage();
    } else if (document.getElementById('stok-page')) {
        handleAuthenticatedPages();
        handleStokPage();
    } else if (document.getElementById('monitoring-page') || 
               document.getElementById('rekap-page') || 
               document.getElementById('histori-page')) {
        handleAuthenticatedPages();
    }
});

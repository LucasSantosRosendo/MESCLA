document.addEventListener('DOMContentLoaded', function() {
    var contactItems = document.querySelectorAll('.contact-item');

    contactItems.forEach(function(item) {
        item.classList.add('hidden');
    });

    function searchCompanies() {
        var searchQuery = document.querySelector('.search').value.toLowerCase();
        if (searchQuery === '') {
            contactItems.forEach(function(item) {
                item.classList.add('hidden');
            });
        } else {
            contactItems.forEach(function(item) {
                var companyName = item.querySelector('.user_info span').textContent.toLowerCase();
                if (companyName.includes(searchQuery)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }
    }

    document.querySelector('.search').addEventListener('input', searchCompanies);

    contactItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var companyName = this.querySelector('.user_info span').textContent;
            var companyImgSrc = this.querySelector('.img_cont img').src;

            document.querySelector('.empty_chat_message').classList.add('hidden');
            var chatWindow = document.querySelector('.chat_window');
            document.querySelector('#company_name').textContent = companyName;
            document.querySelector('#company_img').src = companyImgSrc;
            chatWindow.classList.remove('hidden');
        });
    });

    document.querySelector('#attach_btn').addEventListener('click', function() {
        document.querySelector('#file_input').click();
    });

    document.querySelector('#file_input').addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            console.log('Arquivo selecionado:', file.name);
        }
    });
});

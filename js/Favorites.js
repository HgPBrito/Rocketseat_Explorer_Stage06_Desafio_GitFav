import { GithubUser } from "./GithubUser.js";

//classe que contem a logica e estrutura dos dados
export class Favorites {

    constructor(root){
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase());

            if(userExists) {
                throw new Error('Usuário já cadastrado!');
            }

            const user = await GithubUser.search(username);

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!');
            }

            this.entries = [user, ...this.entries];
            this.update();

        }catch(error) {
            alert(error.message);
        }
    }    

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login);

        this.entries = filteredEntries;
        this.update();
        this.save();
    }
}

//classe que cria a visualização e eventos do html
export class FavoritesView extends Favorites{

    constructor(root){
        super(root);

        this.tbody = this.root.querySelector('table tbody');

        this.update();
        this.onadd();
    }

    onadd() {
        const addButton = this.root.querySelector('.search button');
        const input = this.root.querySelector('.search input');
    
        // Adicionar evento ao pressionar Enter
        document.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && document.activeElement === input) {
                this.add(input.value);
                input.value = ''; // Limpar o campo após a ação
            }
        });
    
        // Adicionar evento ao botão
        addButton.onclick = () => {
            this.add(input.value);
            input.value = ''; // Limpar o campo após a ação
        };
    }

    update() {
        this.removeAllTr();

        this.entries.forEach(user => {
            const row = this.createRow();

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            row.querySelector('.user img').alt = `Imagem de ${user.login}`;

            row.querySelector('.user a').href = `https://github.com/${user.login}`;

            row.querySelector('.user p').textContent = `${user.name}`;

            row.querySelector('.user span').textContent = `${user.login}`;

            row.querySelector('.repositories').textContent = `${user.public_repos}`;

            row.querySelector('.followers').textContent = `${user.followers}`;


            row.querySelector('.remove').onclick = () => {
                const isOk = confirm("Tem certeza que deseja deletar essa linha? ");

                if(isOk) {
                    this.delete(user);
                }
            };


            this.tbody.append(row);
            this.root.querySelector(".nocontent").classList.add("noview");
        });

        
        
    }

    createRow() {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/hgpbrito.png" alt="Imagem de HgPBrito">
                <a href="https://github.com/hgpbrito" target="_blank">
                    <p>Hugo Brito</p>
                    <span>HgPBrito</span>
                </a>
            </td>

            <td class="repositories">
                xx
            </td>

            <td class="followers">
                xxx
            </td>

            <td>
                <button class="remove">remover</button>
            </td>
        `;

        return tr;
    }

    removeAllTr() {
        
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove();            
        });

        this.root.querySelector(".nocontent").classList.remove("noview");
    }
}
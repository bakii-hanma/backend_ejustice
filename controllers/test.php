<?php if (isset($_SESSION["user"]["role"]) && $_SESSION["user"]["role"] == 0) { ?>
    <div id="cartSidePenal" drawer-end class="fixed inset-y-0 flex flex-col w-full transition-transform duration-300 ease-in-out transform bg-white shadow dark:bg-zink-600 ltr:right-0 rtl:left-0 md:w-96 z-drawer show">
        <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500">
            <div class="grow">
                <h5 class="mb-0 text-16">Shopping Cart <span class="inline-flex items-center justify-center w-5 h-5 ml-1 text-[11px] font-medium border rounded-full text-white bg-custom-500 border-custom-500">3</span></h5>
            </div>
            <div class="shrink-0">
                <button data-drawer-close="cartSidePenal" class="transition-all duration-150 ease-linear text-slate-500 hover:text-slate-800"><i data-lucide="x" class="size-4"></i></button>
            </div>
        </div>
        <div class="px-4 py-3 text-sm text-green-500 border border-transparent bg-green-50 dark:bg-green-400/20">
            <span class="font-bold underline">TAILWICK50</span> Coupon code applied successfully.
        </div>
        <div>
            <div class="h-[calc(100vh_-_370px)] p-4 overflow-y-auto product-list">
                <div class="flex flex-col gap-4">
                    <div class="flex gap-2 product">
                        <div class="flex items-center justify-center w-12 h-12 rounded-md bg-slate-100 shrink-0 dark:bg-zink-500">
                            <img src="assets/images/img-012.png" alt="" class="h-8">
                        </div>
                        <div class="overflow-hidden grow">
                            <div class="ltr:float-right rtl:float-left">
                                <button class="transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-red-500 dark:hover:text-red-500"><i data-lucide="x" class="size-4"></i></button>
                            </div>
                            <a href="#!" class="transition-all duration-200 ease-linear hover:text-custom-500">
                                <h6 class="mb-1 text-15">Cotton collar t-shirts for men</h6>
                            </a>
                            <div class="flex items-center mb-3">
                                <h5 class="text-base product-price"> $<span>155.32</span></h5>
                                <div class="font-normal rtl:mr-1 ltr:ml-1 text-slate-500 dark:text-zink-200">(Fashion)</div>
                            </div>
                            <div class="flex items-center justify-between gap-3">
                                <div class="inline-flex text-center input-step">
                                    <button type="button" class="border w-9 h-9 leading-[15px] minus bg-white dark:bg-zink-700 dark:border-zink-500 ltr:rounded-l rtl:rounded-r transition-all duration-200 ease-linear border-slate-200 text-slate-500 dark:text-zink-200 hover:bg-custom-500 dark:hover:bg-custom-500 hover:text-custom-50 dark:hover:text-custom-50 hover:border-custom-500 dark:hover:border-custom-500 focus:bg-custom-500 dark:focus:bg-custom-500 focus:border-custom-500 dark:focus:border-custom-500 focus:text-custom-50 dark:focus:text-custom-50"><i data-lucide="minus" class="inline-block size-4"></i></button>
                                    <input type="number" class="w-12 text-center h-9 border-y product-quantity dark:bg-zink-700 focus:shadow-none dark:border-zink-500" value="2" min="0" max="100" readonly>
                                    <button type="button" class="transition-all duration-200 ease-linear bg-white border dark:bg-zink-700 dark:border-zink-500 ltr:rounded-r rtl:rounded-l w-9 h-9 border-slate-200 plus text-slate-500 dark:text-zink-200 hover:bg-custom-500 dark:hover:bg-custom-500 hover:text-custom-50 dark:hover:text-custom-50 hover:border-custom-500 dark:hover:border-custom-500 focus:bg-custom-500 dark:focus:bg-custom-500 focus:border-custom-500 dark:focus:border-custom-500 focus:text-custom-50 dark:focus:text-custom-50"><i data-lucide="plus" class="inline-block size-4"></i></button>
                                </div>
                                <h6 class="product-line-price">310.64</h6>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 product">
                        <div class="flex items-center justify-center w-12 h-12 rounded-md bg-slate-100 shrink-0 dark:bg-zink-500">
                            <img src="assets/images/img-03.png" alt="" class="h-8">
                        </div>
                        <div class="overflow-hidden grow">
                            <div class="ltr:float-right rtl:float-left">
                                <button class="transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-red-500 dark:hover:text-red-500"><i data-lucide="x" class="size-4"></i></button>
                            </div>
                            <a href="#!" class="transition-all duration-200 ease-linear hover:text-custom-500">
                                <h6 class="mb-1 text-15">Like style travel black handbag</h6>
                            </a>
                            <div class="flex items-center mb-3">
                                <h5 class="text-base product-price"> $<span>349.95</span></h5>
                                <div class="font-normal rtl:mr-1 ltr:ml-1 text-slate-400 dark:text-zink-200">(Luggage)</div>
                            </div>
                            <div class="flex items-center justify-between gap-3">
                                <div class="inline-flex text-center input-step">
                                    <button type="button" class="border w-9 h-9 leading-[15px] minus bg-white dark:bg-zink-700 dark:border-zink-500 ltr:rounded-l rtl:rounded-r transition-all duration-200 ease-linear border-slate-200 text-slate-500 dark:text-zink-200 hover:bg-custom-500 dark:hover:bg-custom-500 hover:text-custom-50 dark:hover:text-custom-50 hover:border-custom-500 dark:hover:border-custom-500 focus:bg-custom-500 dark:focus:bg-custom-500 focus:border-custom-500 dark:focus:border-custom-500 focus:text-custom-50 dark:focus:text-custom-50"><i data-lucide="minus" class="inline-block size-4"></i></button>
                                    <input type="number" class="w-12 text-center h-9 border-y product-quantity dark:bg-zink-700 focus:shadow-none dark:border-zink-500" value="1" min="0" max="100" readonly>
                                    <button type="button" class="transition-all duration-200 ease-linear bg-white border dark:bg-zink-700 dark:border-zink-500 ltr:rounded-r rtl:rounded-l w-9 h-9 border-slate-200 plus text-slate-500 dark:text-zink-200 hover:bg-custom-500 dark:hover:bg-custom-500 hover:text-custom-50 dark:hover:text-custom-50 hover:border-custom-500 dark:hover:border-custom-500 focus:bg-custom-500 dark:focus:bg-custom-500 focus:border-custom-500 dark:focus:border-custom-500 focus:text-custom-50 dark:focus:text-custom-50"><i data-lucide="plus" class="inline-block size-4"></i></button>
                                </div>
                                <h6 class="product-line-price">349.95</h6>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 product">
                        <div class="flex items-center justify-center w-12 h-12 rounded-md bg-slate-100 shrink-0 dark:bg-zink-500">
                            <img src="assets/images/img-09.png" alt="" class="h-8">
                        </div>
                        <div class="overflow-hidden grow">
                            <div class="ltr:float-right rtl:float-left">
                                <button class="transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-red-500 dark:hover:text-red-500"><i data-lucide="x" class="size-4"></i></button>
                            </div>
                            <a href="#!" class="transition-all duration-200 ease-linear hover:text-custom-500">
                                <h6 class="mb-1 text-15">Blive Printed Men Round Neck</h6>
                            </a>
                            <div class="flex items-center mb-3">
                                <h5 class="text-base product-price">$<span>546.74</span></h5>
                                <div class="font-normal rtl:mr-1 ltr:ml-1 text-slate-400 dark:text-zink-200">(Fashion)</div>
                            </div>
                            <div class="flex items-center justify-between gap-3">
                                <div class="inline-flex text-center input-step">
                                    <button type="button" class="border w-9 h-9 leading-[15px] minus bg-white dark:bg-zink-700 dark:border-zink-500 ltr:rounded-l rtl:rounded-r transition-all duration-200 ease-linear border-slate-200 text-slate-500 dark:text-zink-200 hover:bg-custom-500 dark:hover:bg-custom-500 hover:text-custom-50 dark:hover:text-custom-50 hover:border-custom-500 dark:hover:border-custom-500 focus:bg-custom-500 dark:focus:bg-custom-500 focus:border-custom-500 dark:focus:border-custom-500 focus:text-custom-50 dark:focus:text-custom-50"><i data-lucide="minus" class="inline-block size-4"></i></button>
                                    <input type="number" class="w-12 text-center h-9 border-y product-quantity dark:bg-zink-700 focus:shadow-none dark:border-zink-500" value="4" min="0" max="100" readonly>
                                    <button type="button" class="transition-all duration-200 ease-linear bg-white border dark:bg-zink-700 dark:border-zink-500 ltr:rounded-r rtl:rounded-l w-9 h-9 border-slate-200 plus text-slate-500 dark:text-zink-200 hover:bg-custom-500 dark:hover:bg-custom-500 hover:text-custom-50 dark:hover:text-custom-50 hover:border-custom-500 dark:hover:border-custom-500 focus:bg-custom-500 dark:focus:bg-custom-500 focus:border-custom-500 dark:focus:border-custom-500 focus:text-custom-50 dark:focus:text-custom-50"><i data-lucide="plus" class="inline-block size-4"></i></button>
                                </div>
                                <h6 class="product-line-price end">2,186.96</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 border-t border-slate-200 dark:border-zink-500">
    
                <table class="w-full mb-3 ">
                    <tbody class="table-total">
                        <tr>
                            <td class="py-2">Sub Total :</td>
                            <td class="text-right cart-subtotal">$2,847.55</td>
                        </tr>
                        <tr>
                            <td class="py-2">Discount <span class="text-muted">(TAILWICK50)</span>:</td>
                            <td class="text-right cart-discount">-$476.00</td>
                        </tr>
                        <tr>
                            <td class="py-2">Shipping Charge :</td>
                            <td class="text-right cart-shipping">$89.00</td>
                        </tr>
                        <tr>
                            <td class="py-2">Estimated Tax (12.5%) : </td>
                            <td class="text-right cart-tax">$70.62</td>
                        </tr>
                        <tr class="font-semibold">
                            <td class="py-2">Total : </td>
                            <td class="text-right cart-total">$2,531.17</td>
                        </tr>
                    </tbody>
                </table>
                <div class="flex items-center justify-between gap-3">
                    <a href="apps-ecommerce-product-grid.html" class="w-full text-white btn bg-slate-500 border-slate-500 hover:text-white hover:bg-slate-600 hover:border-slate-600 focus:text-white focus:bg-slate-600 focus:border-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:border-slate-600 active:ring active:ring-slate-100 dark:ring-slate-400/10">Continue Shopping</a>
                    <a href="apps-ecommerce-checkout.html" class="w-full text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20">Checkout</a>
                </div>
            </div>
        </div>
    </div>
    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <div class="group-data-[sidebar-size=lg]:ltr:md:ml-vertical-menu group-data-[sidebar-size=lg]:rtl:md:mr-vertical-menu group-data-[sidebar-size=md]:ltr:ml-vertical-menu-md group-data-[sidebar-size=md]:rtl:mr-vertical-menu-md group-data-[sidebar-size=sm]:ltr:ml-vertical-menu-sm group-data-[sidebar-size=sm]:rtl:mr-vertical-menu-sm pt-[calc(theme('spacing.header')_*_1)] pb-[calc(theme('spacing.header')_*_0.8)] px-4 group-data-[navbar=bordered]:pt-[calc(theme('spacing.header')_*_1.3)] group-data-[navbar=hidden]:pt-0 group-data-[layout=horizontal]:mx-auto group-data-[layout=horizontal]:max-w-screen-2xl group-data-[layout=horizontal]:px-0 group-data-[layout=horizontal]:group-data-[sidebar-size=lg]:ltr:md:ml-auto group-data-[layout=horizontal]:group-data-[sidebar-size=lg]:rtl:md:mr-auto group-data-[layout=horizontal]:md:pt-[calc(theme('spacing.header')_*_1.6)] group-data-[layout=horizontal]:px-3 group-data-[layout=horizontal]:group-data-[navbar=hidden]:pt-[calc(theme('spacing.header')_*_0.9)]">
            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <div class="flex flex-col gap-2 py-4 md:flex-row md:items-center print:hidden">
                    <div class="grow">
                        <h5 class="text-16">Tableau de bord</h5>
                    </div>
                    <ul class="flex items-center gap-2 text-sm font-normal shrink-0">
                        <li class="text-slate-700 dark:text-zink-100">
                            Tableau de bord
                        </li>
                    </ul>
                </div>
                

                <div class="grid grid-cols-12 2xl:grid-cols-12 gap-x-5">
                    <div id="establishmentCard" class="col-span-12 md:order-3 lg:col-span-6 2xl:col-span-3 card">
                        <div id="cardBody" class="card-body">
                            <div id="gridContainer" class="grid grid-cols-12">
                                <div id="establishmentInfo" class="col-span-8 md:col-span-9">
                                    <p id="establishmentLabel" class="text-slate-500 dark:text-slate-200">Nombre d'Établissements</p>
                                    <h5 id="establishmentCount" class="mt-3 mb-4">
                                        <span id="establishmentCounter" class="counter-value"></span>
                                    </h5>
                                    <p id="publicEstablishmentLabel" class="text-slate-500 dark:text-slate-200">Établissements Publics</p>
                                    <h5 id="publicEstablishmentCount" class="mt-3 mb-4">
                                        <span id="publicEstablishmentCounter" class="counter-value"></span>
                                    </h5>
                                    <p id="privateEstablishmentLabel" class="text-slate-500 dark:text-slate-200">Établissements Privés</p>
                                    <h5 id="privateEstablishmentCount" class="mt-3 mb-4">
                                        <span id="privateEstablishmentCounter" class="counter-value"></span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:order-4 lg:col-span-6 2xl:col-span-3 card">
                        <div class="card-body">
                            <div class="grid grid-cols-12">
                                <div class="col-span-8 md:col-span-9">
                                    <p class="text-slate-500 dark:text-slate-200">Professeurs</p>
                                    <h5 class="mt-3 mb-4">
                                        <span id="cadrePedagogiqueCounter" class="counter-value">0</span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:order-7 2xl:order-5 lg:col-span-12 2xl:col-span-6 2xl:row-span-2 card">
                        <div class="card-body">
                            <h6 class="mb-3 text-15">Resultat par etablissement</h6>
                            <div id="chart" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-green-500"]' dir="ltr"></div>
                        </div>
                    </div>

                    <div id="cadreAcademiqueCard" class="col-span-12 md:order-5 2xl:order-6 lg:col-span-6 2xl:col-span-3 card">
                        <div id="cadreAcademiqueCardBody" class="card-body">
                            <div id="cadreAcademiqueGridContainer" class="grid grid-cols-12">
                                <div id="cadreAcademiqueInfo" class="col-span-8 md:col-span-9">
                                    <p id="cadreAcademiqueLabel" class="text-slate-500 dark:text-slate-200">Etudiants</p>
                                    <h5 id="cadreAcademiqueCount" class="mt-3 mb-4">
                                        <span id="cadreAcademiqueCounter" class="counter-value">0</span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- <div class="col-span-12 md:order-6 2xl:order-7 lg:col-span-6 2xl:col-span-3 card">
                        <div class="card-body">
                            <div class="grid grid-cols-12">
                                <div class="col-span-8 md:col-span-9">
                                    <p class="text-slate-500 dark:text-slate-200">Personnel administratif / d'appui </p>
                                    <h5 class="mt-3 mb-4"><span class="counter-value" data-target="110">0</span></h5>
                                </div>
                                <div class="col-span-4 md:col-span-3">
                                    <div id="rejectedCandidates" data-chart-colors='["bg-red-500"]' dir="ltr" class="grow apex-charts"></div>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 mt-3">
                                <p class="text-slate-500 dark:text-slate-200 grow"><span class="font-medium text-red-500">16%</span> Increase</p>
                                <p class="text-slate-500 dark:text-slate-200">This Month</p>
                            </div>
                        </div>
                    </div> -->

                    <div class="col-span-12 md:order-8 2xl:col-span-9 card">
                        <div class="card-body">
                            <div class="grid items-center grid-cols-1 gap-3 mb-5 xl:grid-cols-12">
                                <div class="xl:col-span-3">
                                    <h6 class="text-15">Apercu des etablissements</h6>
                                </div><!--end col-->
                                <div class="xl:col-span-4 xl:col-start-10">
                                    <div class="flex gap-3">
                                        <div class="relative grow">
                                        </div>
                                        <a href="./?nav=etablissement" class="bg-white border-dashed shrink-0 text-custom-500 btn border-custom-500 hover:text-custom-500 hover:bg-custom-50 hover:border-custom-600 focus:text-custom-600 focus:bg-custom-50 focus:border-custom-600 active:text-custom-600 active:bg-custom-50 active:border-custom-600 dark:bg-zink-700 dark:ring-custom-400/20 dark:hover:bg-custom-800/20 dark:focus:bg-custom-800/20 dark:active:bg-custom-800/20"> Voir +</a>
                                    </div>
                                </div><!--end col-->
                            </div><!--end grid-->
                            <div class="-mx-5 overflow-x-auto">
                                <table class="w-full whitespace-nowrap" id="customerTable">
                                    <thead class="ltr:text-left rtl:text-right bg-slate-100 text-slate-500 dark:text-zink-200 dark:bg-zink-600">
                                        <tr>
                                            <th class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">#</th>
                                            <th class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">établissement</th>
                                            <th class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">effectif du personnel administratif et d'appui</th>
                                            <th class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">effectif enseignant</th>
                                            <th class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">effectif filière</th>
                                            <th class="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500">effectif élève</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:order-11 lg:col-span-6 xl:col-span-4 2xl:col-span-3 card">
                        <div class="!pb-0 card-body">
                            <div class="flex items-center justify-between">
                                <h6 class="mb-3 text-15">Nb d'élèves par établissement</h6>
                                <a href="./?nav=resultat" class="px-2.5 py-0.5 text-xs inline-block text-center font-medium shrink-0 rounded border bg-white border-green-400 text-green-500 dark:bg-zink-700 dark:border-green-700">Voir +</a>
                            </div>
                        </div>
                        <div id="NombreEleves" class="pb-5">
                            <!-- Contenu dynamique ici -->
                        </div>
                    </div>

                    <!-- Ajout de la CDN Chart.js dans la section head ou juste avant la fermeture de body -->
                    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

                    <!-- Modification de la disposition des graphiques -->
                    <div class="col-span-12 grid grid-cols-3 gap-4 md:order-12">
                        <!-- Graphique Doughnut pour les étudiants -->
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-3 text-15">Répartition des étudiants par sexe</h6>
                                <canvas id="studentGenderChart"></canvas>
                            </div>
                        </div>

                        <!-- Graphique Pie pour les professeurs -->
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-3 text-15">Répartition des professeurs par sexe</h6>
                                <canvas id="teacherGenderChart"></canvas>
                            </div>
                        </div>

                        <!-- Graphique Polar Area pour le personnel d'appui et administratif -->
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-3 text-15">Répartition du personnel</h6>
                                <canvas id="staffPolarChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- container-fluid -->
        </div>
        <!-- End Page-content -->

        <?php include("./contents/components/footer.php"); ?>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const randomString = Math.random().toString(36).substring(7);
            const url_etablisement = `./backends/?route=getEtablissementDetails&cacheBuster=${randomString}`;
            const etablissementsList = document.getElementById('NombreEleves');
            const url_etablissements = './backends/?route=CompterElevesParEtablissement&cacheBuster=' + randomString;
            
            function getAbbreviation(filiereName) {
                const syllablesToIgnore = ['de', 'des', 'du', 'la', 'le', 'les', 'l\'', 'd\'', 'et']; // Liste des syllabes à ignorer
                const words = filiereName.split(' ');
                let abbreviation = '';

                words.forEach(word => {
                    // Vérifie si le mot est une syllabe à ignorer
                    if (!syllablesToIgnore.includes(word.toLowerCase())) {
                        // Si le mot commence par une apostrophe (ex: "l'informatique"), prendre la lettre qui suit
                        if (word.includes("'")) {
                            const letterAfterApostrophe = word.split("'")[1];
                            if (letterAfterApostrophe) {
                                abbreviation += letterAfterApostrophe.charAt(0).toUpperCase();
                            }
                        } else {
                            // Sinon, prendre la première lettre du mot
                            abbreviation += word.charAt(0).toUpperCase();
                        }
                    }
                });

                return abbreviation;
            }

            function loadNoteEtablissements() {
                axios.get(url_etablissements)
                    .then(function (response) {
                        const etablissements = response.data.slice(0, 6); // Get only the first 6
                        console.log(etablissements);
                        
                        etablissementsList.innerHTML = ''; // Clear the existing content

                        if (etablissements.length > 0) {
                            etablissements.forEach(etablissement => {
                                const card = `
                                    <div class="flex flex-col h-[150px] gap-1 px-5">
                                        <div class="flex flex-col gap-3">
                                            <div class="border rounded-md border-slate-200 dark:border-zink-500">
                                                <div class="flex flex-wrap items-center gap-3 p-2">
                                                    <div class="rounded-full size-10 shrink-0">
                                                        <img src="./backends/photo_etablissement/${etablissement.logo_etablissement}" alt="${etablissement.etablissement_nom}" class="h-10 rounded-full">
                                                    </div>
                                                    <div class="grow">
                                                        <h6 class="mb-1"><a href="#!">${getAbbreviation(etablissement.etablissement_nom)}</a></h6>
                                                        <p class="text-slate-500 dark:text-zink-200">${etablissement.email}</p>
                                                    </div>
                                                    <div class="relative dropdown shrink-0">
                                                        <button type="button" class="flex items-center justify-center w-[30px] h-[30px] p-0 bg-white text-slate-500 btn hover:text-slate-500 hover:bg-slate-100 focus:text-slate-500 focus:bg-slate-100 active:text-slate-500 active:bg-slate-100 dark:bg-zink-700 dark:hover:bg-slate-500/10 dark:focus:bg-slate-500/10 dark:active:bg-slate-500/10 dropdown-toggle" id="interviewDropdown" data-bs-toggle="dropdown">
                                                            <i data-lucide="more-vertical" class="inline-block size-4"></i>
                                                        </button>
                                                    
                                                        <ul class="absolute z-50 hidden py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem] dark:bg-zink-600" aria-labelledby="interviewDropdown">
                                                            <li>
                                                                <a class="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" href="#!">Overview</a>
                                                            </li>
                                                            <li>
                                                                <a class="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" href="#!">Edit</a>
                                                            </li>
                                                            <li>
                                                                <a class="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" href="#!">Delete</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="p-2 border-t border-slate-200 dark:border-zink-500">
                                                    <div class="flex flex-col gap-3 md:items-center md:flex-row">
                                                        <p class="text-slate-500 dark:text-zink-200 shrink-0">Nombre d'élèves: </p>
                                                        <p class="text-slate-500 dark:text-zink-200 grow">${etablissement.nombre_elevs} élèves</p>
                                                        <a href="./?nav=voir_resultats&id=${etablissement.etablissement_id}" class="px-2.5 py-0.5 text-xs inline-block text-center font-medium shrink-0 rounded border bg-white border-green-400 text-green-500 dark:bg-zink-700 dark:border-green-700">Voir les résultats</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                                etablissementsList.insertAdjacentHTML('beforeend', card);
                            });
                        } else {
                            etablissementsList.innerHTML = '<p class="noresult">Aucun établissement trouvé.</p>';
                        }
                    })
                    .catch(function (error) {
                        console.error('There was an error fetching the establishments:', error);
                    });
            }

            // Fonction pour charger et afficher les établissements
            function loadEtablissements() {
                axios.get(url_etablisement)
                    .then(function (response) {
                        const { success, etablissements } = response.data;

                        if (success && Array.isArray(etablissements)) {
                            const tbody = $('#customerTable tbody');
                            tbody.empty(); // Vider les lignes existantes

                            if (etablissements.length > 0) {
                                etablissements.forEach((etablissement, index) => {
                                    const row = `
                                    <tr>
                                        <td class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">${index + 1}</td>
                                        <td class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">
                                            <div class="flex gap-2">
                                                <div class="grow">
                                                    <h6>${etablissement.nom_etablissement.trim()}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">${etablissement.nombre_personnels}</td>
                                        <td class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">${etablissement.nombre_professeurs}</td>
                                        <td class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">${etablissement.nombre_filieres}</td>
                                        <td class="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500">${etablissement.nombre_etudiants}</td>
                                    </tr>
                                    `;
                                    tbody.append(row);
                                });
                            } else {
                                // Afficher un message si aucun établissement n'est trouvé
                                tbody.append('<tr><td colspan="6" class="text-center text-slate-500 py-5">Aucun établissement trouvé</td></tr>');
                            }
                        } else {
                            console.error('La réponse de l\'API est invalide ou success=false');
                        }
                    })
                    .catch(function (error) {
                        console.error('Erreur lors de la récupération des établissements:', error);
                        // Afficher un message d'erreur en cas de problème
                        const tbody = $('#customerTable tbody');
                        tbody.empty().append('<tr><td colspan="6" class="text-center text-red-500 py-5">Erreur lors de la récupération des données. Veuillez réessayer plus tard.</td></tr>');
                    });
            }

            axios.get(`./backends/?route=getEtablissementCountChange&cacheBuster=${randomString}`).then(response => {
                const data = response.data;

                console.log(data);
                
                // Mettre à jour le nombre total d'établissements
                const establishmentCounter = document.getElementById('establishmentCounter');
                establishmentCounter.innerText = data.currentTotal; // Directly set the text content

                // Mettre à jour le pourcentage et le texte associé
                const percentageTextElement = document.getElementById('percentageText');
                let percentageText = '';

                if (data.percentageChange > 0) {
                    percentageText = `<span id="percentageValue" class="font-medium text-green-500">${data.percentageChange}%</span> Augmentation`;
                } else if (data.percentageChange < 0) {
                    percentageText = `<span id="percentageValue" class="font-medium text-red-500">${Math.abs(data.percentageChange)}%</span> Diminution`;
                } else {
                    percentageText = `Pas d'augmentation/diminution`;
                }

                percentageTextElement.innerHTML = percentageText;
            });

            axios.get(`./backends/?route=getCadrePedagogiqueCountChange&cacheBuster=${randomString}`).then(response => {
                const data = response.data;

                console.log(data);
                
                // Mettre à jour le nombre total de cadres pédagogiques
                const cadrePedagogiqueCounter = document.getElementById('cadrePedagogiqueCounter');
                cadrePedagogiqueCounter.innerText = data.total_professeurs; // Directly set the text content

                // Mettre à jour le texte du pourcentage et l'état associé
                const percentageTextElement = document.getElementById('percentageTextPedagogique');
                let percentageText = '';

                // if (data.percentageChange > 0) {
                //     percentageText = `<span class="font-medium text-green-500">${data.percentageChange}%</span> Augmentation`;
                // } else if (data.percentageChange < 0) {
                //     percentageText = `<span class="font-medium text-red-500">${Math.abs(data.percentageChange)}%</span> Diminution`;
                // } else {
                //     percentageText = `Pas d'augmentation/diminution`;
                // }

                percentageTextElement.innerHTML = percentageText;
            });

            axios.get(`./backends/?route=getCadreAcademiqueCountChange&cacheBuster=${randomString}`).then(response => {
                const data = response.data;

                console.log(data);
                
                // Mettre à jour le nombre total d'établissements
                const cadreAcademiqueCounter = document.getElementById('cadreAcademiqueCounter');
                cadreAcademiqueCounter.innerText = data.grandTotal; // Directly set the text content

                // Mettre à jour le texte du pourcentage et l'état associé
                const percentageTextElement = document.getElementById('percentageTextAcademique');
                let percentageText = '';

                // if (data.percentageChange > 0) {
                //     percentageText = `<span class="font-medium text-green-500">${data.percentageChange}%</span> Augmentation`;
                // } else if (data.percentageChange < 0) {
                //     percentageText = `<span class="font-medium text-red-500">${Math.abs(data.percentageChange)}%</span> Diminution`;
                // } else {
                //     percentageText = `Pas d'augmentation/diminution`;
                // }

                percentageTextElement.innerHTML = percentageText;
            });

            axios.get(`./backends/?route=ListeResultatsParEtablissement&cacheBuster=${randomString}`)
                .then(function(response) {
                    const results = response.data;

                    const etablissements = [];
                    const admisSeries = [];
                    const ajourneSeries = [];

                    results.forEach(result => {
                        etablissements.push(getAbbreviation(result.etablissement_nom));
                        admisSeries.push(result.nombre_admis);
                        ajourneSeries.push(result.nombre_ajourne);
                    });

                    const chartData = {
                        series: [
                            {
                                name: 'Admis',
                                data: admisSeries
                            },
                            {
                                name: 'Ajourné',
                                data: ajourneSeries
                            }
                        ],
                        chart: {
                            type: 'line',  // Ensure that the chart type is specified
                            height: 300
                        },
                        xaxis: {
                            categories: etablissements
                        },
                        yaxis: {
                            title: {
                                text: "Nombre d'élèves"
                            }
                        }
                    };

                    const chart = new ApexCharts(document.querySelector("#chart"), chartData);
                    chart.render();
                })
                .catch(function(error) {
                    console.error('Error fetching data:', error);
                });

            // Appel initial pour charger les établissements
            loadEtablissements();
            loadNoteEtablissements(); // Initial load of establishments
        });

        // Configuration des graphiques
        document.addEventListener('DOMContentLoaded', function() {
            // Configuration du graphique Doughnut pour les étudiants
            const studentCtx = document.getElementById('studentGenderChart').getContext('2d');
            new Chart(studentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Femmes', 'Hommes'],
                    datasets: [{
                        data: [10, 15], // Remplacez par vos données réelles
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: false
                        }
                    }
                }
            });

            // Configuration du graphique Pie pour les professeurs
            const teacherCtx = document.getElementById('teacherGenderChart').getContext('2d');
            new Chart(teacherCtx, {
                type: 'pie',
                data: {
                    labels: ['Femmes', 'Hommes'],
                    datasets: [{
                        data: [8, 12], // Remplacez par vos données réelles
                        backgroundColor: [
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)'
                        ],
                        borderColor: [
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: false
                        }
                    }
                }
            });

            // Configuration du graphique Polar Area pour le personnel
            const staffCtx = document.getElementById('staffPolarChart').getContext('2d');
            new Chart(staffCtx, {
                type: 'polarArea',
                data: {
                    labels: ['Personnel d\'appui', 'Personnel administratif'],
                    datasets: [{
                        data: [5, 10], // Remplacez par vos données réelles
                        backgroundColor: [
                            'rgba(153, 102, 255, 0.8)',
                            'rgba(255, 159, 64, 0.8)'
                        ],
                        borderColor: [
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: false
                        }
                    }
                }
            });
        });
    </script>
<?php } else { ?>
    <div id="cartSidePenal" drawer-end class="fixed inset-y-0 flex flex-col w-full transition-transform duration-300 ease-in-out transform bg-white shadow dark:bg-zink-600 ltr:right-0 rtl:left-0 md:w-96 z-drawer show">
        <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500">
            <div class="grow">
                <h5 class="mb-0 text-16">Shopping Cart <span class="inline-flex items-center justify-center w-5 h-5 ml-1 text-[11px] font-medium border rounded-full text-white bg-custom-500 border-custom-500">3</span></h5>
            </div>
            <div class="shrink-0">
                <button data-drawer-close="cartSidePenal" class="transition-all duration-150 ease-linear text-slate-500 hover:text-slate-800"><i data-lucide="x" class="size-4"></i></button>
            </div>
        </div>
        <div class="px-4 py-3 text-sm text-green-500 border border-transparent bg-green-50 dark:bg-green-400/20">
            <span class="font-bold underline">TAILWICK50</span> Coupon code applied successfully.
        </div>
        <div>
            <div class="h-[calc(100vh_-_370px)] p-4 overflow-y-auto product-list">
                <div class="flex flex-col gap-4">
                    <!-- Your product list here -->
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-12 2xl:grid-cols-12 gap-x-5">
        <div id="establishmentCard" class="col-span-12 md:order-3 lg:col-span-6 2xl:col-span-3 card">
            <div id="cardBody" class="card-body">
                <div id="gridContainer" class="grid grid-cols-12">
                    <div id="establishmentInfo" class="col-span-8 md:col-span-9">
                        <p id="establishmentLabel" class="text-slate-500 dark:text-slate-200">Nombre d'Établissements</p>
                        <h5 id="establishmentCount" class="mt-3 mb-4">
                            <span id="establishmentCounter" class="counter-value"></span>
                        </h5>
                        <p id="publicEstablishmentLabel" class="text-slate-500 dark:text-slate-200">Établissements Publics</p>
                        <h5 id="publicEstablishmentCount" class="mt-3 mb-4">
                            <span id="publicEstablishmentCounter" class="counter-value"></span>
                        </h5>
                        <p id="privateEstablishmentLabel" class="text-slate-500 dark:text-slate-200">Établissements Privés</p>
                        <h5 id="privateEstablishmentCount" class="mt-3 mb-4">
                            <span id="privateEstablishmentCounter" class="counter-value"></span>
                        </h5>
                    </div>
                </div>
            </div>
        </div>

        <!-- Graphiques -->
        <div class="col-span-12 md:order-4 lg:col-span-6 2xl:col-span-3 card">
            <div class="card-body">
                <h6 class="mb-3 text-15">Graphiques des établissements</h6>
                <canvas id="establishmentChart"></canvas>
            </div>
        </div>
    </div>

    <!-- Ajout de la CDN Chart.js dans la section head ou juste avant la fermeture de body -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const randomString = Math.random().toString(36).substring(7);
            const url_etablisement = `./backends/?route=getEtablissementCountChange&cacheBuster=${randomString}`;

            axios.get(url_etablisement).then(response => {
                const data = response.data;

                // Mettre à jour le nombre total d'établissements
                document.getElementById('establishmentCounter').innerText = data.total.current;
                document.getElementById('publicEstablishmentCounter').innerText = data.public.current;
                document.getElementById('privateEstablishmentCounter').innerText = data.prive.current;

                // Configuration du graphique des établissements
                const ctx = document.getElementById('establishmentChart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Publics', 'Privés'],
                        datasets: [{
                            label: 'Nombre d\'Établissements',
                            data: [data.public.current, data.prive.current],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(255, 99, 132, 0.2)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            });
        });
    </script>
<?php } ?>
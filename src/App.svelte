<script lang="ts">
  import { generateXml } from './generate-xml';
  let barcodes: string[] = [];

  function handleBarcodeSubmit(event: Event) {
    if (event.target instanceof HTMLFormElement) {
      const barcodeElement = event.target.elements.namedItem('barcode') as HTMLInputElement | null;
      if (barcodeElement != null) {
        const barcode = barcodeElement.value.trim();
        if (barcode) {
          barcodes = [...barcodes, barcode];
        } else {
          console.error('barcode пустой');
        }
        barcodeElement.value = '';
        barcodeElement.focus();
      } else {
        console.error('barcodeElement пустой');
      }
    }
  }

  function removeBarcode(index: number) {
    barcodes = [...barcodes.slice(0, index), ...barcodes.slice(index + 1)];
  }

  function handleGenerateXml() {
    console.info('handleGenerateXml', barcodes);
    const xml = generateXml(barcodes);
    if (xml) {
      const a = document.createElement('a');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(xml);
      a.download = 'file.txt';
      a.click();
      document.body.removeChild(a);
    }
  }

  function actionFocus(node: HTMLInputElement) {
    node.focus();
  }

  // $: console.info(barcodes);
</script>

<div class="application">
  <form class="barcode__input" on:submit|preventDefault="{handleBarcodeSubmit}">
    <label>
      <span>Сюда попадает штрих-код:</span>
      <input type="text" name="barcode" required use:actionFocus />
    </label>
    <input type="submit" value="Добавить" />
  </form>
  <ul class="barcodes__list">
    {#each barcodes as code, idx}
      <li>
        <code>{code}</code>
        <button on:click="{() => removeBarcode(idx)}">Удалить</button>
      </li>
    {:else}
      <li>Пока нет кодов</li>
    {/each}
  </ul>
  <button on:click="{handleGenerateXml}">Подготовить XML</button>
</div>

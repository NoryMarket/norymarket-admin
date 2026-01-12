<template>
  <q-drawer v-model="config.isLeftSidebarOpen" show-if-above bordered>
    <div class="column full-height">
      <!-- HEADER -->
      <div class="q-pa-md">
        <div class="column items-center">
          <q-avatar size="72px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>

          <div class="text-h4 text-weight-bold">Nory Art</div>
        </div>
      </div>

      <q-separator />

      <!-- MENU PRINCIPAL -->
      <q-scroll-area class="col">
        <q-list padding>
          <IfPermission permission="dashboard">
            <q-item clickable to="/dashboard">
              <q-item-section avatar>
                <q-icon color="primary" name="view_cozy" />
              </q-item-section>
              <q-item-section>Dashboard</q-item-section>
            </q-item>
            <q-separator />
          </IfPermission>

          <q-item-label header>{{ $gettext('OPERACIONES') }}</q-item-label>

          <IfPermission permission="orders">
            <q-item clickable to="/orders">
              <q-item-section avatar>
                <q-icon color="primary" name="view_cozy" />
              </q-item-section>
              <q-item-section>{{ $gettext('Ordenes') }}</q-item-section>
            </q-item>

            <q-expansion-item icon="receipt" :label="$gettext('Producción')" default-opened>
              <q-list>
                <IfPermission permission="production">
                  <q-item clickable to="/orders-production">
                    <q-item-section>{{ $gettext('Ordenes de Producción') }}</q-item-section>
                  </q-item>
                </IfPermission>

                <IfPermission permission="bom">
                  <q-item clickable to="/bom">
                    <q-item-section>{{ $gettext('Recetas (BOM)') }}</q-item-section>
                  </q-item>
                </IfPermission>

                <IfPermission permission="waste">
                  <q-item clickable to="/production-waste">
                    <q-item-section>{{ $gettext('Merma') }}</q-item-section>
                  </q-item>
                </IfPermission>
              </q-list>
            </q-expansion-item>

            <q-separator />
          </IfPermission>

          <q-item-label header>{{ $gettext('INVENTARIO') }}</q-item-label>

          <IfPermission permission="supply">
            <q-item clickable to="/supply">
              <q-item-section avatar>
                <q-icon color="primary" name="view_cozy" />
              </q-item-section>

              <q-item-section>{{ $gettext('Stock') }}</q-item-section>
            </q-item>
          </IfPermission>
          <IfPermission permission="supply-type">
            <q-item clickable to="/supply-type">
              <q-item-section avatar>
                <q-icon color="primary" name="view_cozy" />
              </q-item-section>

              <q-item-section>{{ $gettext('Tipos de Insumo') }}</q-item-section>
            </q-item>
          </IfPermission>
          <IfPermission permission="waste">
            <q-item clickable to="/waste">
              <q-item-section avatar>
                <q-icon color="primary" name="view_cozy" />
              </q-item-section>

              <q-item-section>{{ $gettext('Pérdidas') }}</q-item-section>
            </q-item>
            <q-separator />
          </IfPermission>

          <q-separator />

          <q-item-label header>{{ $gettext('CATALOGO') }}</q-item-label>

          <IfPermission permission="products">
            <q-item clickable to="/products">
              <q-item-section avatar>
                <q-icon color="primary" name="view_cozy" />
              </q-item-section>

              <q-item-section>{{ $gettext('Productos') }}</q-item-section>
            </q-item>
          </IfPermission>
        </q-list>
      </q-scroll-area>

      <!-- FOOTER -->
      <div>
        <q-separator />

        <q-list padding>
          <q-item clickable v-ripple to="/settings">
            <q-item-section avatar>
              <q-icon name="settings" color="primary" />
            </q-item-section>
            <q-item-section>{{ $gettext('Configuración') }}</q-item-section>
          </q-item>

          <q-separator class="q-my-sm" />

          <q-item clickable v-ripple to="/profile">
            <q-item-section avatar>
              <q-avatar size="32px">
                <q-icon name="person" />
              </q-avatar>
            </q-item-section>
            <q-item-section>{{ $gettext('Perfil') }}</q-item-section>
          </q-item>

          <!-- <q-item>
            <q-item-section>
              <LogoutButton class="full-width" />
            </q-item-section>
          </q-item> -->
        </q-list>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { QItem } from 'quasar';
import { useGlobalConfig } from 'src/stores/globalConfig';
//import LogoutButton from './LogoutButton.vue';
import IfPermission from './IfPermission.vue';

const config = useGlobalConfig();
</script>

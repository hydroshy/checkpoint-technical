export const DASHBOARD_REQUEST_FORM_HTML = `      <!-- =========================================================================
           TAB 6: PRINTABLE FORM V4.1 (RETAINED FROM ORIGINAL FORM)
           ========================================================================= -->
      <!-- =========================================================================
           TAB 1: BIỂU MẪU NHẬP LIỆU (TECHNICAL REQUEST FORM)
           ========================================================================= -->
      <div v-show="canCreateRequest && activeTab === 'v4-form'" class="space-y-6">
        
        <!-- Header Info Card -->
        <header class="glass-card rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-2xl text-sky-500 shadow-inner">
              🖨️
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight">Phiếu Yêu Cầu Kỹ Thuật</h1>
              <p class="text-xs text-slate-400 font-medium mt-0.5">Printing Dept. Repair Request & Downtime Form</p>
            </div>
          </div>
          <div class="flex flex-col items-end w-full sm:w-auto">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Số tài liệu (Doc No.)</div>
            <div class="font-mono text-xl sm:text-2xl font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/20 w-full sm:w-auto text-center sm:text-right mb-3">
              {{ form.docNo || '—' }}
            </div>
            
            <!-- Backup / Restore / Excel buttons -->
            <div class="flex flex-wrap justify-end gap-2 w-full">
              <button
                @click="triggerRestore"
                class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Phục hồi form từ file JSON"
              >
                <span>📂</span> Phục hồi
              </button>
              <button
                @click="triggerBackup"
                class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Sao lưu form ra file JSON"
              >
                <span>💾</span> Sao lưu
              </button>
              <button
                @click="openExcelUploader"
                class="text-xs bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 hover:bg-sky-100 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition cursor-pointer"
                title="Nạp dữ liệu nhân sự từ Excel"
              >
                <span>📊</span> Nạp NV Excel
              </button>
            </div>
            <input type="file" id="file_restore" accept=".json" class="hidden" @change="processRestoreFile" />
          </div>
        </header>

        <!-- FORM SECTIONS -->
        <div class="space-y-6">

          <!-- SECTION 1: THÔNG TIN YÊU CẦU -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-sky-500/5 px-6 py-4 border-b border-sky-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-sky-500/30">1</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Thông Tin Yêu Cầu</h2>
                <p class="text-xs text-slate-500 font-medium">Dành cho bộ phận sản xuất (Requester)</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Row 1: Time & Person -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày yêu cầu</label>
                  <input type="date" v-model="form.reqDate" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ yêu cầu</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.reqTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('reqTime')"
                      class="input-box w-full px-4 py-2.5 rounded-xl font-mono text-sm font-medium outline-none transition cursor-pointer"
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5 lg:col-span-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Người yêu cầu</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.reqBy"
                      list="employee_list"
                      placeholder="Nhập Mã NV hoặc tên..."
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('reqBy')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 2: Machine -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Công nghệ in (Tech)</label>
                  <select v-model="form.printTech" @change="handleTechChange" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition cursor-pointer">
                    <option value="">— Chọn Công Nghệ —</option>
                    <option v-for="(machines, tech) in machineCatalog" :key="tech" :value="tech">{{ tech }}</option>
                    <option value="OTHER">Khác...</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Tên máy (Machine)</label>
                  <div class="flex gap-2">
                    <select
                      v-if="!customMachineMode"
                      v-model="form.machineName"
                      @change="handleMachineSelectChange"
                      class="input-box flex-1 px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition cursor-pointer"
                    >
                      <option value="">— {{ form.printTech ? 'Chọn Máy' : 'Chọn Công Nghệ Trước' }} —</option>
                      <option v-for="m in currentTechMachines" :key="m" :value="m">{{ m }}</option>
                      <option value="OTHER">📌 Nhập máy khác...</option>
                    </select>
                    <input
                      v-else
                      type="text"
                      v-model="form.machineName"
                      placeholder="Nhập tên máy..."
                      class="input-box flex-1 px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="customMachineMode = !customMachineMode"
                      class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition"
                      :title="customMachineMode ? 'Chọn từ danh sách' : 'Nhập tên máy thủ công'"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 3: Problem Description -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Mô tả sự cố (Problem Description)</label>
                <textarea
                  v-model="form.problem"
                  rows="3"
                  placeholder="Mô tả chi tiết tình trạng lỗi, hiện tượng hư hỏng..."
                  class="input-box px-4 py-3 rounded-xl text-sm outline-none transition resize-y"
                ></textarea>
              </div>

              <!-- Row 4: Status & Priority Toggles -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Trạng thái sự cố</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="machineStatus" id="st_first" value="First Bulk Print" v-model="form.machineStatus" class="toggle-radio hidden" />
                      <label
                        for="st_first"
                        :class="form.machineStatus === 'First Bulk Print' ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >
                        🆕 Hàng SX lần đầu
                      </label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="machineStatus" id="st_repeat" value="Repeat Print" v-model="form.machineStatus" class="toggle-radio hidden" />
                      <label
                        for="st_repeat"
                        :class="form.machineStatus === 'Repeat Print' ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >
                        🔁 Hàng SX nhiều lần
                      </label>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Mức độ ưu tiên</label>
                  <div class="flex flex-wrap gap-2.5 items-center">
                    <div class="relative flex-1 min-w-[110px]">
                      <input type="radio" name="priority" id="pr_imm" value="Immediate" v-model="form.priority" class="toggle-radio-danger hidden" />
                      <label
                        for="pr_imm"
                        :class="form.priority === 'Immediate' ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >
                        🔴 Hỗ trợ ngay
                      </label>
                    </div>
                    <div class="relative flex-1 min-w-[110px]">
                      <input type="radio" name="priority" id="pr_hold" value="Hold" v-model="form.priority" class="toggle-radio-warning hidden" />
                      <label
                        for="pr_hold"
                        :class="form.priority === 'Hold' ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >
                        🟡 Chạy tạm
                      </label>
                    </div>
                    <div class="relative flex-1 min-w-[110px] flex flex-col gap-1.5">
                      <div>
                        <input type="radio" name="priority" id="pr_other" value="Other" v-model="form.priority" class="toggle-radio-purple hidden" />
                        <label
                          for="pr_other"
                          :class="form.priority === 'Other' ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                          class="toggle-label flex items-center justify-center gap-1.5 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                        >
                          📌 Khác
                        </label>
                      </div>
                      <input
                        v-if="form.priority === 'Other'"
                        type="text"
                        v-model="form.priorityOther"
                        placeholder="Nhập mức ưu tiên..."
                        class="input-box w-full px-3 py-1.5 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 2: PHÂN TÍCH & XỬ LÝ -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-emerald-500/5 px-6 py-4 border-b border-emerald-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/30">2</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Phân Tích & Xử Lý</h2>
                <p class="text-xs text-slate-500 font-medium">Dành cho bộ phận kỹ thuật (Technical Dept)</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Row 1: Technical Receiver -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="flex flex-col gap-1.5 lg:col-span-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Người tiếp nhận (Kỹ thuật)</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.recvBy"
                      list="employee_list"
                      placeholder="Mã NV hoặc tên kỹ thuật viên..."
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none transition"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('recvBy')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              <!-- Row 2: Date & Time Calculation -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày nhận</label>
                  <input type="date" v-model="form.recvDate" @change="calculateDowntime" class="input-box px-3.5 py-2.5 rounded-xl text-sm outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ nhận</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.recvTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('recvTime')"
                      class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono text-sm text-center outline-none cursor-pointer"
                    />
                    <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày hoàn thành</label>
                  <input type="date" v-model="form.finishDate" @change="calculateDowntime" class="input-box px-3.5 py-2.5 rounded-xl text-sm outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Giờ hoàn thành</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.finishTime"
                      readonly
                      placeholder="Chọn giờ..."
                      @click="openTimePicker('finishTime')"
                      class="input-box w-full px-3.5 py-2.5 rounded-xl font-mono text-sm text-center outline-none cursor-pointer"
                    />
                    <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🕒</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Downtime (Phút)</label>
                  <input
                    type="number"
                    v-model="form.downtime"
                    readonly
                    class="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-mono font-bold rounded-xl text-center outline-none"
                  />
                </div>
              </div>

              <!-- Row 3: Text areas -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Nguyên nhân gốc (Root Cause)</label>
                  <textarea
                    v-model="form.rootCause"
                    rows="3"
                    placeholder="Phân tích nguyên nhân cốt lõi gây ra sự cố..."
                    class="input-box px-4 py-3 rounded-xl text-sm outline-none resize-y"
                  ></textarea>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Hành động khắc phục (Action Taken)</label>
                  <textarea
                    v-model="form.actionTaken"
                    rows="3"
                    placeholder="Các bước và phương pháp kỹ thuật đã xử lý..."
                    class="input-box px-4 py-3 rounded-xl text-sm outline-none resize-y"
                  ></textarea>
                </div>
              </div>

              <!-- Row 4: 4M & Process Stage -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Phân loại lỗi (4M)</label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_man" value="MAN" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label
                        for="cat_man"
                        :class="form.errCat === 'MAN' ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center px-2 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >Con người</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_mac" value="MACHINE" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label
                        for="cat_mac"
                        :class="form.errCat === 'MACHINE' ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center px-2 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >Máy móc</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_mat" value="MATERIAL" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label
                        for="cat_mat"
                        :class="form.errCat === 'MATERIAL' ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center px-2 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >Vật tư</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errCat" id="cat_met" value="METHOD" v-model="form.errCat" class="toggle-radio-purple hidden" />
                      <label
                        for="cat_met"
                        :class="form.errCat === 'METHOD' ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center px-2 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >P.Pháp</label>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Nhóm công đoạn</label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div class="relative">
                      <input type="radio" name="errType" id="typ_prepress" value="Prepress" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label
                        for="typ_prepress"
                        :class="form.errType === 'Prepress' ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >💻 Trước in</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errType" id="typ_press" value="Press" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label
                        for="typ_press"
                        :class="form.errType === 'Press' ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >🖨️ Trong in</label>
                    </div>
                    <div class="relative">
                      <input type="radio" name="errType" id="typ_postpress" value="PostPress" v-model="form.errType" class="toggle-radio-purple hidden" />
                      <label
                        for="typ_postpress"
                        :class="form.errType === 'PostPress' ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex justify-center items-center gap-1.5 px-3 py-2 border rounded-lg cursor-pointer text-xs font-semibold transition"
                      >✂️ Sau in</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 3: HÌNH ẢNH CẢI THIỆN -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-amber-500/5 px-6 py-4 border-b border-amber-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-amber-500/30">3</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Hình Ảnh Cải Thiện</h2>
                <p class="text-xs text-slate-500 font-medium">Before & After Repair Photos (Tối đa 3 ảnh/mục)</p>
              </div>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Photos Before -->
                <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col h-full hover:border-sky-400 transition">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái lỗi (Trước)</span>
                    <span class="text-[11px] font-mono text-slate-400">{{ form.photosBefore.length }}/3 ảnh</span>
                  </div>
                  <div class="flex flex-wrap gap-3 mb-4 min-h-[90px] items-center">
                    <div v-if="form.photosBefore.length === 0" class="text-xs text-slate-400 italic text-center w-full py-4">Chưa có ảnh</div>
                    <div v-for="(photo, i) in form.photosBefore" :key="'before-'+i" class="photo-thumbnail">
                      <img :src="photo" alt="Photo Before" />
                      <div class="photo-remove-btn" @click="removePhoto('before', i)">✕</div>
                    </div>
                  </div>
                  <div class="mt-auto grid grid-cols-2 gap-3">
                    <input type="file" id="file_before" accept="image/*" multiple class="hidden" @change="e => handleImageUpload(e, 'before')" />
                    <input type="file" id="cam_before" accept="image/*" capture="environment" class="hidden" @change="e => handleImageUpload(e, 'before')" />
                    <button type="button" @click="triggerUpload('file_before')" class="py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                      📁 <span>Chọn ảnh</span>
                    </button>
                    <button type="button" @click="triggerUpload('cam_before')" class="py-2 px-3 bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-semibold hover:bg-sky-100 flex items-center justify-center gap-1.5 cursor-pointer">
                      📷 <span>Chụp ảnh</span>
                    </button>
                  </div>
                </div>

                <!-- Photos After -->
                <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col h-full hover:border-emerald-400 transition">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Đã khắc phục (Sau)</span>
                    <span class="text-[11px] font-mono text-slate-400">{{ form.photosAfter.length }}/3 ảnh</span>
                  </div>
                  <div class="flex flex-wrap gap-3 mb-4 min-h-[90px] items-center">
                    <div v-if="form.photosAfter.length === 0" class="text-xs text-slate-400 italic text-center w-full py-4">Chưa có ảnh</div>
                    <div v-for="(photo, i) in form.photosAfter" :key="'after-'+i" class="photo-thumbnail">
                      <img :src="photo" alt="Photo After" />
                      <div class="photo-remove-btn" @click="removePhoto('after', i)">✕</div>
                    </div>
                  </div>
                  <div class="mt-auto grid grid-cols-2 gap-3">
                    <input type="file" id="file_after" accept="image/*" multiple class="hidden" @change="e => handleImageUpload(e, 'after')" />
                    <input type="file" id="cam_after" accept="image/*" capture="environment" class="hidden" @change="e => handleImageUpload(e, 'after')" />
                    <button type="button" @click="triggerUpload('file_after')" class="py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
                      📁 <span>Chọn ảnh</span>
                    </button>
                    <button type="button" @click="triggerUpload('cam_after')" class="py-2 px-3 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer">
                      📷 <span>Chụp ảnh</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 4: XÁC NHẬN & BÀN GIAO -->
          <section class="glass-card rounded-2xl overflow-hidden">
            <div class="bg-indigo-500/5 px-6 py-4 border-b border-indigo-500/15 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/30">4</div>
              <div>
                <h2 class="font-bold text-base sm:text-lg">Xác Nhận & Bàn Giao</h2>
                <p class="text-xs text-slate-500 font-medium">Production & Technical Handover Confirmation</p>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Quality & Ticket Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Chất lượng in sau xử lý</label>
                  <div class="flex gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="chkQuality" id="qa_ok" value="OK" v-model="form.chkQuality" class="toggle-radio-success hidden" />
                      <label
                        for="qa_ok"
                        :class="form.chkQuality === 'OK' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >✅ Đạt chuẩn</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="chkQuality" id="qa_ng" value="NG" v-model="form.chkQuality" class="toggle-radio-danger hidden" />
                      <label
                        for="qa_ng"
                        :class="form.chkQuality === 'NG' ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >❌ Chưa đạt</label>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Tình trạng sự cố</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                      <input type="radio" name="chkStatus" id="st_done" value="DONE" v-model="form.chkStatus" class="toggle-radio-success hidden" />
                      <label
                        for="st_done"
                        :class="form.chkStatus === 'DONE' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >🟢 Đã khắc phục</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="chkStatus" id="st_monitor" value="MONITOR" v-model="form.chkStatus" class="toggle-radio-warning hidden" />
                      <label
                        for="st_monitor"
                        :class="form.chkStatus === 'MONITOR' ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >🟡 Đang theo dõi</label>
                    </div>
                    <div class="relative flex-1">
                      <input type="radio" name="chkStatus" id="st_support" value="SUPPORT" v-model="form.chkStatus" class="toggle-radio-danger hidden" />
                      <label
                        for="st_support"
                        :class="form.chkStatus === 'SUPPORT' ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-400/50 shadow font-bold' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        class="toggle-label flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold w-full transition"
                      >🔴 Cần hỗ trợ</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Work Order & Waste metrics -->
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-1.5 col-span-2 lg:col-span-1">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Work order</label>
                  <input type="text" v-model="form.workOrder" placeholder="Số WO..." class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Qty</label>
                  <input type="number" v-model.number="form.woTotalQty" @input="calculateWastePercent" placeholder="0" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Waste</label>
                  <input type="number" v-model.number="form.wasteQty" @input="calculateWastePercent" placeholder="0" class="input-box px-4 py-2.5 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Đơn vị</label>
                  <select v-model="form.wasteUnit" class="input-box px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none cursor-pointer">
                    <option value="Pcs">Pcs (Cái/Nhãn)</option>
                    <option value="Mét">Mét</option>
                    <option value="Tờ in">Tờ in</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">% Waste</label>
                  <input type="text" v-model="form.wastePercent" readonly placeholder="0%" class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-mono font-bold rounded-xl outline-none text-center" />
                </div>
              </div>

              <!-- Prod Handover Sign -->
              <div class="pt-5 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-1.5 w-full md:w-1/2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Đại diện Sản Xuất ký nhận (Prod. Received By)</label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="form.prodMgr"
                      list="employee_list"
                      placeholder="Mã NV hoặc tên người nhận..."
                      class="input-box w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none"
                    />
                    <button
                      type="button"
                      @click="openPersonPicker('prodMgr')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition"
                      title="Chọn nhân sự"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      

      <!-- =========================================================================
           TAB 7: HISTORY V4.1
           ========================================================================= -->
      <!-- =========================================================================
           TAB 2: LỊCH SỬ PHIẾU YÊU CẦU (HISTORY & TRACKING)`;
